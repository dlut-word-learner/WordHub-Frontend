<template>
  <div class="word-spelling-app">
    <el-alert
      :title="$t('qwerty.typingToStart')"
      :center="true"
      :show-icon="true"
      v-if="!stopWatch.isRunning.value && !isAllFinished"
    />
    <div class="word-container" v-if="!isAllFinished">
      <div class="words">
        <WordCard id="prevWord" :word="prevWord" />
        <div :class="{ shake: shake }">
          <WordCard
            :word="currWord"
            :isCurrWord="true"
            :userInput="userInput"
            @done="inputDone"
          />
        </div>
        <WordCard id="nextWord" :word="nextWord" :userInput="''" />
      </div>
      <div id="inputArea">
        <el-input
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
      <el-result icon="success" :title="$t('qwerty.finishPrompt')"> </el-result>
    </div>
    <el-button
      type="primary"
      @click="promptGoToNextWord"
      :disabled="!stopWatch.isRunning"
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
        :stopWatch="stopWatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
      />
    </div>
    <el-dialog v-model="confirmVisible" :title="$t('qwerty.prompt')" width="30%">
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
import { Ref, ref, watch, onBeforeMount } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useDictStore } from "../store/dictStore";
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
  // API tailored for Qwerty mode?

  await axios
    .get(`/api/dicts/${dictStore.id}/learn`, {
      params: {
        num: optionsStore.qwertyWordsPerRound,
      },
    })
    .then((response) => {
      words.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("qwerty.errGetWords"));
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

function init(): void {
  if (!stopWatch.isRunning.value) stopWatch.start();
}

function loadWord(): void {
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

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord(): void {
  isCurrCorrect.value ? goToNextWord() : (confirmVisible.value = true);
}

function goToNextWord(): void {
  tries.value++;

  if (words.value && ++currWordIndex.value < words.value.length) loadWord();
  else finish();
}

function playTypingSound(): void {
  if (optionsStore.isSoundEnabled) typingSound.play();
}

function inputDone(isCorrect: boolean): void {
  if (isCorrect) {
    ElMessage({
      message: t("qwerty.correctSpelling"),
      duration: 500,
      type: "success",
    });

    if (optionsStore.isSoundEnabled) correctSound.play();

    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
    else isCurrCorrect.value = true;
  } else {
    ElMessage({
      message: t("qwerty.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    if (optionsStore.isSoundEnabled) wrongSound.play();
    tries.value++;
    userInput.value = "";
  }
}

function finish(): void {
  isAllFinished.value = true;
  stopWatch.pause();
}
</script>

<style scoped>
.word-spelling-app {
  text-align: center;
  margin: auto 3em;
  margin-top: 1em;
  font-family: Arial, sans-serif;
}

.word-container {
  margin: 1em;
}

.words {
  width: 640px;
  margin: auto auto;
  margin-bottom: 1.5em;
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
