<template>
  <el-container style="height: 100%" direction="vertical">
  <el-container style="height: 100%" direction="vertical">
    <el-collapse-transition>
      <el-header
        class="header"
        v-show="!stopwatch.isRunning.value && !isAllFinished"
      >
        <el-alert
          :title="$t('qwerty.typingToStart')"
          :center="true"
          :show-icon="true"
        />
      </el-header>
    </el-collapse-transition>
    <el-main class="qwertyMain">
    <el-main class="qwertyMain">
      <Transition name="finishAnimation" mode="out-in">
        <el-container class="word-spelling-app" v-if="!isAllFinished">
          <el-main class="words" v-if="words">
            <TransitionGroup name="visibleWordCards">
              <WordCard
                class="word-card-instance"
                :class="{
                  'pre-word-card': isCurrWord(index + 1),
                  'next-word-card': isCurrWord(index - 1),
                  shake: shake && isCurrWord(index),
                }"
                v-for="index in visibleWordIndex"
                :key="index"
                :word="words?.[index]"
                :emphasized="isCurrWord(index)"
                :userInput="
                  isCurrWord(index)
                    ? userInput
                    : index > currWordIndex
                    ? ''
                    : undefined
                "
                :sound="isCurrWord(index) ? currWordSound : undefined"
                :lang="lang"
                @done="inputDone"
              />
            </TransitionGroup>
          </el-main>
          <el-main id="inputArea">
            <el-input
              size="large"
              v-model="userInput"
              @keypress="typingSound.play()"
              @keydown="startTiming"
              :class="{ shake: shake }"
              :disabled="isAllFinished"
              :clearable="true"
              autofocus
              @keypress.enter="promptGoToNextWord"
              ref="userInputRef"
              :maxlength="currWord?.name.length"
            />
          </el-main>
          <el-main id="nextWordButton">
          <el-main id="nextWordButton">
            <el-button
              size="large"
              type="primary"
              @click="promptGoToNextWord"
              :disabled="!stopwatch.isRunning"
              v-if="!isAllFinished"
            >
              {{ $t("qwerty.goToNextWord") }}
            </el-button>
          </el-main>
          <el-main id="progressBar">
            <el-progress
              :show-text="false"
              :percentage="words ? (currWordIndex / words.length) * 100 : 0"
            />
          </el-main>
        </el-container>
        <el-container
          class="result"
          direction="vertical"
          @keypress.enter="goBack"
          v-else
        >
          <el-main>
            <el-result
              icon="success"
              :title="$t('qwerty.finishPrompt')"
            ></el-result>
          </el-main>
          <el-button
            type="primary"
            @click="goBack"
            size="large"
            id="goBackButton"
          >
            {{ $t("qwerty.goBack") }}
          </el-button>
        </el-container>
      </Transition>
    </el-main>
    <el-main class="statsFooter">
    <el-main class="statsFooter">
      <Stats
        class="stats"
        :stopwatch="stopwatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
        v-if="words"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onDeactivated, nextTick } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useOptionsStore } from "../store/optionsStore";
import { Task, useTaskStore } from "../store/taskStore";
import { useI18n } from "vue-i18n";
import { Lang, WordVo, excludeCache } from "./Dicts/common";
import { getWordMain } from "./WordCard";
import WordCard from "./WordCard.vue";
import Stats from "./Stats.vue";
import axios from "axios";
import router from "../router";
import correctSoundRes from "../assets/audio/correct.wav";
import typingSoundRes from "../assets/audio/typing.wav";
import wrongSoundRes from "../assets/audio/wrong.wav";
import { onActivated } from "vue";
import { Ref } from "vue";

const props = defineProps<{ lang: Lang; dictId: any; num: any }>();

const { t } = useI18n();
const optionsStore = useOptionsStore();
const taskStore = useTaskStore();
const words = ref<WordVo[]>();
const currWordIndex = ref(0);
const visibleWordIndex = ref<number[]>([]);

const currWord = computed(() => {
  return words.value?.[currWordIndex.value];
});
const isCurrWord = (index: number) => {
  return index == currWordIndex.value;
};

const tries = ref(0);
const skips = ref(0);
const userInput = ref("");

// The spelling of current word is correct, waiting for "Next Word" button to be pressed
const isCurrCorrect = ref(false);
const isAllFinished = ref(false);
const shake = ref(false);
const stopwatch = useStopwatch(0, false);
const userInputRef: Ref<HTMLInputElement | null> = ref(null);
const correctSound = new Howl({ src: correctSoundRes });
const wrongSound = new Howl({ src: wrongSoundRes });
const typingSound = new Howl({ src: typingSoundRes });

const currWordSound = computed(() => {
  if (!currWord.value) return undefined;
  return new Howl({
    src: `/dictYoudao/dictvoice?le=${
      props.lang == Lang.English ? "eng" : "jap"
    }&audio=${getWordMain(currWord.value, props.lang)}`,
    format: "mp3",
  });
});

const initData = async () => {
  excludeCache.value = "";

  await axios
    .get(`/api/dicts/${props.dictId}/learn`, {
      params: {
        num: props.num,
      },
    })
    .then((response) => {
      words.value = response.data;
      taskStore.type = Task.QwertyMode;
      taskStore.url = router.currentRoute.value.fullPath;
      if (!words.value) return;
      if (words.value.length >= 1)
        setTimeout(() => visibleWordIndex.value.push(0), 100);
      if (words.value.length >= 2)
        setTimeout(() => visibleWordIndex.value.push(1), 200);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("qwerty.errGetWords"));
      router.back();
    });
};
initData();

onDeactivated(() => {
  stopwatch.pause();
});

onActivated(() => {
  nextTick(() => {
    userInputRef.value?.focus();
  });
});

function startTiming(): void {
  if (!stopwatch.isRunning.value) stopwatch.start();
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord(): void {
  if (isAllFinished.value) return;
  if (!isCurrCorrect.value) {
    ElMessageBox.confirm(t("qwerty.promptGoToNextWord"), t("qwerty.prompt"), {
      confirmButtonText: t("qwerty.confirm"),
      cancelButtonText: t("qwerty.cancel"),
    })
      .then((data) => {
        if (data == "confirm") {
          skips.value++;
          goToNextWord();
        }
      })
      .catch(() => {
        return;
      });
  } else goToNextWord();
}

function goToNextWord(): void {
  isCurrCorrect.value = false;
  tries.value++;

  if (words.value && currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value != 0) visibleWordIndex.value?.shift();
    currWordIndex.value++;

    if (currWordIndex.value + 1 < words.value.length)
      visibleWordIndex.value?.push(currWordIndex.value + 1);

    userInput.value = "";
  } else {
    currWordIndex.value++;
    visibleWordIndex.value = [];
    finish();
  }
}

function inputDone(isCorrect: boolean): void {
  if (isCorrect) {
    ElMessage({
      message: t("qwerty.correctSpelling"),
      duration: 500,
      type: "success",
    });

    correctSound.play();

    if (optionsStore.autoNext) {
      isCurrCorrect.value = true;
      setTimeout(goToNextWord, 500);
    } else isCurrCorrect.value = true;
  } else {
    ElMessage({
      message: t("qwerty.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    wrongSound.play();
    tries.value++;
    userInput.value = "";
  }
}

function finish(): void {
  isAllFinished.value = true;
  stopwatch.pause();
}

function goBack(): void {
  taskStore.type = Task.None;
  router.push("/dicts");
}
</script>

<style scoped>
.word-spelling-app {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 76vh;
  padding: 20px;
  gap: 2px;
  font-family: Arial, sans-serif;
  transition: all 0.5s ease;
}

.header {
  flex: 1;
  z-index: 998;
  position: absolute;
  width: 100%;
}

.qwertyMain {
  padding: 0;
  flex: 23;
}

.statsFooter {
  position: sticky;
  bottom: 0.1vh;
  padding: 15px;
  flex: 4;
  height: 10%;
  transition: all 0.5s ease;
}

.words {
  /* margin-bottom: 10px; */
  margin: 10px;
  padding: 0 20px;
  width: 96%;
  min-height: 33vw;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
  flex: 8 0 auto;
}

#progressBar {
  width: 96%;
  margin: 10px;
  padding: 0;
  flex: 1 0 auto;
}

#inputArea {
  width: 50%;
  /* min-width: 30%;
  max-width: 50%; */
  padding: 0 10px;
  flex: 2 0 auto;
}

#nextWordButton {
  padding: 0;
  min-width: 120px;
  flex: 1 0 auto;
}

.word-card-instance {
  margin: 0.5% 1%;
  display: inline-block;
  transform-origin: center center 20px;
  transform-style: preserve-3d;
}
.word-card-instance:hover {
  scale: 1.05;
}

.pre-word-card {
  transform: rotateY(-5deg);
}

.next-word-card {
  transform: rotateY(5deg);
}

.stats {
  border-radius: 20px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

.stats:hover {
  scale: 1.01;
  transition: all 0.2s ease;
}

.result {
  margin-top: 15%;
  transition: all 0.5s ease;
  align-items: center;
  /* transition-delay: 200ms; */
  /* position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%); */
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.finishAnimation-move,
.finishAnimation-enter-active,
.finishAnimation-leave-active {
  transition: all 0.35s ease;
}

.finishAnimation-enter-from {
  opacity: 0;
}

.finishAnimation-leave-to {
  transform: translateY(-300px);
  opacity: 0;
}

.visibleWordCards-enter-from,
.visibleWordCards-leave-to {
  opacity: 0;
  scale: 0.1;
}

.visibleWordCards-move,
.visibleWordCards-leave-active,
.visibleWordCards-enter-active {
  transition: all 0.5s ease;
}

.visibleWordCards-leave-active {
  position: absolute;
  z-index: -1;
}
</style>
