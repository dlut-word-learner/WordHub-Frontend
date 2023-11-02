<template>
  <div class="word-spelling-app">
    <el-alert
      :title="$t('learn.typingToStart')"
      :center="true"
      :show-icon="true"
      v-if="!stopWatch.isRunning.value && !isAllFinished"
    />
    <div class="word-container" v-if="!isAllFinished">
      <div class="words">
        <WordCard id="prevWord" :word="prevWord" />
        <div :class="{ shake: shake }">
          <WordCard :word="currWord" :userInput="userInput" @done="inputDone" />
        </div>
        <WordCard id="nextWord" :word="nextWord" :userInput="''" />
      </div>
      <div id="inputArea">
        <el-input
          id="userInputBox"
          size="large"
          v-model="userInput"
          @keypress="playTypingSound"
          @keydown="init"
          :class="{ shake: shake }"
          :maxlength="currWord?.name.length"
          :disabled="isAllFinished"
          :clearable="true"
        />
      </div>
    </div>
    <div v-else>
      <el-result icon="success" :title="$t('learn.finishPrompt')"> </el-result>
    </div>
    <el-button
      id="nextWordButton"
      type="primary"
      @click="promptGoToNextWord"
      :disabled="!stopWatch.isRunning"
      v-if="!isAllFinished"
    >
      {{ $t("learn.goToNextWord") }}
    </el-button>
    <el-progress
      id="progressBar"
      :show-text="false"
      :percentage="words ? (currWordIndex / words.length) * 100 : 0"
    />
    <div class="stats-container">
      <Stats
        :stopWatch="stopWatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
      />
    </div>
    <el-dialog v-model="confirmVisible" :title="$t('learn.prompt')" width="30%">
      <span>{{ $t("learn.promptGoToNextWord") }}</span>
      <template #footer>
        <span>
          <el-button @click="confirmVisible = false">
            {{ $t("learn.cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="
              confirmVisible = false;
              skips++;
              goToNextWord();
            "
          >
            {{ $t("learn.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch, onBeforeMount } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { DictAction, useDictStore } from "../store/dictStore";
import { useOptionsStore } from "../store/optionsStore";
import { useI18n } from "vue-i18n";
import { WordVo } from "./Dicts/common";
import { getWordMain, currWordSound, playWordSound } from "./WordCard";
import WordCard from "./WordCard.vue";
import Stats from "./Stats.vue";
import axios from "axios";

const { t } = useI18n();
const dictStore = useDictStore();
const optionsStore = useOptionsStore();

const lang = dictStore.lang;
const words: Ref<WordVo[] | null> = ref(null);
const currWordIndex = ref(0);

const prevWord: Ref<WordVo | undefined> = ref(undefined);
const currWord: Ref<WordVo | undefined> = ref(undefined);
const nextWord: Ref<WordVo | undefined> = ref(undefined);

const tries = ref(0);
const skips = ref(0);
const userInput = ref("");

// The spelling of current word is correct, waiting for "Next Word" button to be pressed
const isCurrCorrect = ref(false);
const isAllFinished = ref(false);
const shake = ref(false);
const stopWatch = useStopwatch(0, false);

const confirmVisible = ref(false);

const correctSound = new Howl({ src: "src/assets/audio/correct.wav" });
const wrongSound = new Howl({ src: "src/assets/audio/wrong.wav" });
const typingSound = new Howl({ src: "src/assets/audio/typing.wav" });
const soundEffects = [correctSound, wrongSound, typingSound];

onBeforeMount(async () => {
  const action = ref("");
  switch (dictStore.action) {
    case DictAction.Learn:
      action.value = "learn";
      break;
    case DictAction.Review:
      action.value = "review";
      break;
  }

  await axios
    .get(`/api/dicts/${dictStore.id}/${action.value}`, {
      params: {
        num: optionsStore.wordsPerRound,
      },
    })
    .then((response) => {
      words.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("learn.errGetWords"));
      return;
    });

  loadWord();
});

watch(
  () => optionsStore.volume,
  (volume) => {
    soundEffects.forEach((sound) => sound.volume(volume / 100));
    currWordSound.value?.volume(volume / 100);
  },
  { immediate: true },
);

function init() {
  if (!stopWatch.isRunning.value) stopWatch.start();
}

function loadWord() {
  if (!words.value) return;

  prevWord.value = words.value[currWordIndex.value - 1];
  currWord.value = words.value[currWordIndex.value];
  nextWord.value = words.value[currWordIndex.value + 1];
  currWordSound.value = new Howl({
    src: `/dictYoudao/dictvoice?le=${
      lang == "en" ? "eng" : "jap"
    }&audio=${getWordMain(currWord.value)}`,
    format: "mp3",
  });

  userInput.value = "";

  playWordSound();
}

function shakeWord() {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord() {
  isCurrCorrect.value ? goToNextWord() : (confirmVisible.value = true);
}

function goToNextWord() {
  tries.value++;

  if (words.value && ++currWordIndex.value < words.value.length) loadWord();
  else finish();
}

function playTypingSound() {
  if (optionsStore.isSoundEnabled) typingSound.play();
}

function inputDone(isCorrect: boolean) {
  if (isCorrect) {
    ElMessage({
      message: t("learn.correctSpelling"),
      duration: 500,
      type: "success",
    });

    if (optionsStore.isSoundEnabled) correctSound.play();

    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
    else isCurrCorrect.value = true;
  } else {
    ElMessage({
      message: t("learn.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    if (optionsStore.isSoundEnabled) wrongSound.play();
    tries.value++;
    userInput.value = "";
  }
}

function finish() {
  isAllFinished.value = true;
  stopWatch.pause();
}
</script>

<style scoped>
.word-spelling-app {
  text-align: center;
  margin: auto 3em;
  margin-top: 2em;
  font-family: Arial, sans-serif;
}

.word-container {
  margin: 20px;
}

.words {
  width: 640px;
  margin: auto auto;
  margin-bottom: 1.5em;
}

#nextWordButton,
#progressBar {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

#inputArea {
  width: 25em;
  text-align: center;
  margin: auto auto;
}

.stats-container {
  margin-top: 10px;
}

#prevWord {
  margin-bottom: 1em;
}

#nextWord {
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
</style>
