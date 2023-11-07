<template>
  <el-container>
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
    <el-main>
      <Transition>
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
            />
            <!-- :maxlength="currWord?.name.length" -->
          </el-main>
          <el-main>
            <el-button
              type="primary"
              @click="promptGoToNextWord"
              :disabled="!stopwatch.isRunning"
              v-if="!isAllFinished"
              id="nextWordButton"
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
        <el-container class="result" v-else>
          <el-main>
            <el-result
              icon="success"
              :title="$t('qwerty.finishPrompt')"
            ></el-result>
          </el-main>
        </el-container>
      </Transition>
    </el-main>
    <el-footer class="statsFooter">
      <Stats
        class="stats"
        :stopwatch="stopwatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
        v-if="words"
      />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onDeactivated } from "vue";
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

function startTiming(): void {
  if (!stopwatch.isRunning.value) stopwatch.start();
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord(): void {
  if (!isCurrCorrect.value) {
    ElMessageBox.confirm(t("qwerty.promptGoToNextWord"), t("qwerty.prompt"), {
      confirmButtonText: t("qwerty.confirm"),
      cancelButtonText: t("qwerty.cancel"),
    })
      .then((data) => {
        if (data == "confirm") skips.value++;
      })
      .catch(() => {
        return;
      });
  } else goToNextWord();
}

function goToNextWord(): void {
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

    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
    else isCurrCorrect.value = true;
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
</script>

<style scoped>
.word-spelling-app {
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  height: 80%;
  gap: 2%;
  font-family: Arial, sans-serif;
  transition: all 0.5s ease;
}

.header {
  z-index: 998;
  position: absolute;
  width: 100%;
}

.word-container {
  margin: 5px 30px;
  width: 98%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2%;
}

.words {
  margin-bottom: 2%;
  width: 100%;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
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

#progressBar {
  width: 96%;
  margin: 10px;
}

#inputArea {
  width: 50%;
  /* min-width: 30%;
  max-width: 50%; */
  padding: 0 20px;
}

.statsFooter {
  transition: all 0.5s ease;
}

.stats {
  /* background-color: #fafafa; */
  border-radius: 20px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

.stats:hover {
  scale: 1.01;
  transition: all 0.2s ease;
}

.result {
  transition: all 0.5s ease;
  transition-delay: 200ms;
  /* position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%); */
}

#nextWordButton {
  min-width: 120px;
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

.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
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
}
</style>
