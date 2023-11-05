<template>
  <div class="word-spelling-app">
    <el-alert
      :title="$t('qwerty.typingToStart')"
      :center="true"
      :show-icon="true"
      v-if="!stopwatch.isRunning.value && !isAllFinished"
    />
    <div class="word-container" v-if="!isAllFinished">
      <div class="words" v-if="words">
        <TransitionGroup name="visibleWordCards">
          <WordCard
            class="word-card-instance"
            :class="{
              'pre-word-card': isCurrWord(index + 1),
              'next-word-card': isCurrWord(index - 1),
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
      </div>
      <div id="inputArea">
        <el-input
          size="large"
          v-model="userInput"
          @keypress="typingSound.play()"
          @keydown="startTiming"
          :class="{ shake: shake }"
          :maxlength="currWord?.name.length"
          :disabled="isAllFinished"
          :clearable="true"
        />
      </div>
    </div>
    <div v-else>
      <el-result icon="success" :title="$t('qwerty.finishPrompt')"> </el-result>
    </div>
    <el-button
      type="primary"
      @click="promptGoToNextWord"
      :disabled="!stopwatch.isRunning"
      v-if="!isAllFinished"
    >
      {{ $t("qwerty.goToNextWord") }}
    </el-button>
    <el-progress
      id="progressBar"
      :show-text="false"
      :percentage="words ? (currWordIndex / words.length) * 100 : 0"
    />
    <div class="stats-container">
      <Stats
        :stopwatch="stopwatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
        v-if="words"
      />
    </div>
    <el-dialog
      v-model="confirmVisible"
      :title="$t('qwerty.prompt')"
      width="30%"
    >
      <span>{{ $t("qwerty.promptGoToNextWord") }}</span>
      <template #footer>
        <span>
          <el-button @click="confirmVisible = false">
            {{ $t("qwerty.cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="
              confirmVisible = false;
              skips++;
              goToNextWord();
            "
          >
            {{ $t("qwerty.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onDeactivated } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useOptionsStore } from "../store/optionsStore";
import { Task, useTaskStore } from "../store/taskStore";
import { useI18n } from "vue-i18n";
import { WordVo, excludeCache } from "./Dicts/common";
import { getWordMain } from "./WordCard";
import WordCard from "./WordCard.vue";
import Stats from "./Stats.vue";
import axios from "axios";
import router from "../router";
import correctSoundRes from "../assets/audio/correct.wav";
import typingSoundRes from "../assets/audio/typing.wav";
import wrongSoundRes from "../assets/audio/wrong.wav";

const props = defineProps<{ lang: string; dictId: any; num: any }>();

const { t } = useI18n();
const optionsStore = useOptionsStore();
const taskStore = useTaskStore();
const words = ref<WordVo[]>();
const currWordIndex = ref(0);
const visibleWordIndex = ref([0, 1]);

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

const confirmVisible = ref(false);

const correctSound = new Howl({ src: correctSoundRes });
const wrongSound = new Howl({ src: wrongSoundRes });
const typingSound = new Howl({ src: typingSoundRes });

const currWordSound = computed(() => {
  if (!currWord.value) return undefined;
  return new Howl({
    src: `/dictYoudao/dictvoice?le=${
      props.lang == "en" ? "eng" : "jap"
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
  isCurrCorrect.value ? goToNextWord() : (confirmVisible.value = true);
}

// TODO: 优化代码
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
  text-align: center;
  margin: 20px 30px;
  font-family: Arial, sans-serif;
}

.word-container {
  margin: 20px;
  width: 98%;
  text-align: center;
}

.words {
  /* margin-bottom: 1.5em; */
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
}

.word-card-instance {
  margin: 10px;
  display: inline-block;
  transform-origin: center center 20px;
  transform-style: preserve-3d;
}

.pre-word-card {
  transform: rotateY(-5deg);
}

.next-word-card {
  transform: rotateY(5deg);
}

#progressBar {
  margin-top: 1em;
}

#inputArea {
  width: 25em;
  text-align: center;
  margin: auto auto;
}

.stats-container {
  margin-top: 1em;
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

/* .visibleWordCards-move,

.visibleWordCards-leave-active {
  transition: all 3s ease-out;
  
} */
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
