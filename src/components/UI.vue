<template>
  <div class="word-spelling-app">
    <el-alert
      :title="$t('ui.typingToStart')"
      :center="true"
      :show-icon="true"
      v-if="!stopWatch.isRunning.value && !isFinished"
    />
    <div class="word-container" v-if="!isFinished">
      <div class="words">
        <WordCard id="prevWord" :isCurrWord="false" :word="prevWord" />
        <div :class="{ shake: shake }">
          <WordCard :isCurrWord="true" :word="currWord" />
        </div>
        <WordCard id="nextWord" :isCurrWord="false" :word="nextWord" />
      </div>
      <div id="inputArea">
        <el-input
          id="userInputBox"
          size="large"
          v-model="userInput"
          @input="checkSpelling"
          @keypress="playTypingSound"
          @keydown="init"
          :class="{ shake: shake }"
          :maxlength="currWord?.name.length"
          :disabled="isFinished"
          :clearable="true"
        />
      </div>
    </div>
    <div v-if="isFinished">
      <el-result icon="success" :title="$t('ui.finishPrompt')"> </el-result>
    </div>
    <el-button
      id="nextWordButton"
      type="primary"
      @click="promptGoToNextWord"
      :disabled="!stopWatch.isRunning"
      v-if="!isFinished"
    >
      {{ $t("ui.goToNextWord") }}
    </el-button>
    <el-progress
      id="progressBar"
      :show-text="false"
      :percentage="words ? (currWordIndex / words.length) * 100 : 0"
    />
    <div class="status-container">
      <table>
        <thead>
          <tr>
            <th>{{ $t("ui.elapsedTime") }}</th>
            <th>{{ $t("ui.progress") }}</th>
            <th>{{ $t("ui.speed") }}</th>
            <th>{{ $t("ui.accuracy") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{
                stopWatch.hours.value < 10
                  ? "0" + stopWatch.hours.value
                  : stopWatch.hours.value
              }}:{{
                stopWatch.minutes.value < 10
                  ? "0" + stopWatch.minutes.value
                  : stopWatch.minutes.value
              }}:{{
                stopWatch.seconds.value < 10
                  ? "0" + stopWatch.seconds.value
                  : stopWatch.seconds.value
              }}
            </td>
            <td>
              {{
                words
                  ? currWordIndex < words.length
                    ? currWordIndex + 1
                    : currWordIndex
                  : 0
              }}
              / {{ words ? words.length : 0 }}
            </td>
            <td>
              {{
                (
                  (currWordIndex - skips) /
                  (stopWatch.hours.value * 60 +
                    stopWatch.minutes.value +
                    stopWatch.seconds.value / 60)
                ).toFixed(0)
              }}
              WPM
            </td>
            <td>
              {{
                currWordIndex - skips > tries
                  ? "100.00"
                  : (((currWordIndex - skips) / tries) * 100).toFixed(2)
              }}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog v-model="confirmVisible" :title="$t('ui.prompt')" width="30%">
      <span>{{ $t("ui.promptGoToNextWord") }}</span>
      <template #footer>
        <span>
          <el-button @click="confirmVisible = false">
            {{ $t("ui.cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="
              confirmVisible = false;
              skips++;
              goToNextWord();
            "
          >
            {{ $t("ui.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, watch } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { DictAction, useDictStore } from "../store/dictStore";
import { useOptionsStore } from "../store/optionsStore";
import { useI18n } from "vue-i18n";
import { WordVo } from "./Dicts/common";
import { getWordMain, currWordSound, playWordSound } from "./WordCard";
import WordCard from "./WordCard.vue";
import axios from "axios";

const { t } = useI18n();
const dictStore = useDictStore();
const optionsStore = useOptionsStore();

const lang = dictStore.lang;
const words: Ref<WordVo[] | null> = ref(null);
const currWordIndex = ref(0);

const prevWord: Ref<WordVo | null> = ref(null);
const currWord: Ref<WordVo | null> = ref(null);
const nextWord: Ref<WordVo | null> = ref(null);
const hiddenWord = ref("");

const tries = ref(0);
const skips = ref(0);
const userInput = ref("");
const isCorrect = ref(false);
const isFinished = ref(false);
const shake = ref(false);
const stopWatch = useStopwatch(0, false);

const confirmVisible = ref(false);

const correctSound = new Howl({ src: "src/assets/audio/correct.wav" });
const wrongSound = new Howl({ src: "src/assets/audio/wrong.wav" });
const typingSound = new Howl({ src: "src/assets/audio/typing.wav" });
const soundEffects = [correctSound, wrongSound, typingSound];

onMounted(async () => {
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
      ElMessage.error(t("ui.errGetWords"));
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

if (optionsStore.isWordHidden) {
  watch(
    userInput,
    (newUserInput) => {
      if (currWord.value) {
        hiddenWord.value =
          newUserInput +
          "_ ".repeat(currWord.value.name.length - newUserInput.length);
      }
    },
    { immediate: true },
  );
}

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
  isCorrect.value = false;
  hiddenWord.value = "_ ".repeat(currWord.value.name.length);

  playWordSound();
}

/**
 * Get the main name of the word.
 * English: return name
 * Japanese: return notation excluding text in parentheses
 */
function getWordMain(word: WordVo | null): string {
  if (!word) return "";
  
  switch (lang) {
    case "en":
      return word.name;
    case "ja":
      return word.extension.notation.replace(/\([^)]*\)/, "");
    default:
      return "";
  }
}

/**
 * Get the pronunciation of the word.
 * English: return usphone (AmE) & ukphone (BrE)
 * Japanese: return text in parentheses in notation
 */
function getWordPhone(word: WordVo | null): string | undefined {
  if (!word) return "";

  switch (lang) {
    case "en":
      return `AmE: ${word.extension.usphone} BrE: ${word.extension.ukphone}`;
    case "ja":
      return word.extension.notation.match(/\([^)]*\)/)?.[0];
    default:
      return "";
  }
}

function shakeWord() {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord() {
  if (!isCorrect.value) confirmVisible.value = true;
}

function goToNextWord() {
  tries.value++;

  if (words.value && ++currWordIndex.value < words.value.length) loadWord();
  else finish();
}

function playTypingSound() {
  if (optionsStore.isSoundEnabled) typingSound.play();
}

function checkSpelling() {
  if (userInput.value.length != currWord.value?.name.length) return;

  isCorrect.value = userInput.value.toLowerCase() === currWord.value.name;
  if (isCorrect.value) {
    ElMessage({
      message: t("ui.correctSpelling"),
      duration: 500,
      type: "success",
    });

    if (optionsStore.isSoundEnabled) correctSound.play();
    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
  } else {
    ElMessage({
      message: t("ui.wrongSpelling"),
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
  isFinished.value = true;
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

.status-container {
  margin-top: 10px;
}

table {
  width: 100%;
}

th,
td {
  padding: 0.5em;
  width: 25%;
}

th {
  border-bottom: 1px solid #ddd;
}

td {
  font-size: 1.5em;
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
