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
        <el-card
          id="prevWord"
          :body-style="{ padding: '0px' }"
          v-if="prevWord.word != '' && optionsStore.showPrevNext"
        >
          <template #header>
            <div class="prevWordMain">{{ prevWord.word }}</div>
          </template>
          <div class="prevWordItem">{{ prevWord.phonetic }}</div>
          <div class="prevWordItem" v-if="!optionsStore.isMeaningHidden">
            {{ prevWord.meaning }}
          </div>
        </el-card>
        <div :class="{ shake: shake }">
          <el-card id="currWord" :body-style="{ padding: '0px' }">
            <template #header v-if="!optionsStore.isWordHidden">
              <div class="currWordMain">{{ currWord.word }}</div>
            </template>
            <template #header v-else>
              <div class="currWordMain">
                {{ hiddenWord }}
              </div>
            </template>
            <div class="currWordItem">
              {{ currWord.phonetic }}
              <img
                src="../assets/img/speaker.png"
                class="speaker"
                @click="playWordSound"
              />
            </div>
            <div class="currWordItem" v-if="!optionsStore.isMeaningHidden">
              {{ currWord.meaning }}
            </div>
          </el-card>
        </div>
        <el-card
          id="nextWord"
          :body-style="{ padding: '0px' }"
          v-if="nextWord.word != '' && optionsStore.showPrevNext"
        >
          <template #header v-if="!optionsStore.isWordHidden">
            <div class="nextWordMain">{{ nextWord.word }}</div>
          </template>
          <template #header v-else>
            <div class="nextWordMain">
              {{ "_ ".repeat(nextWord.word.length) }}
            </div>
          </template>
          <div class="nextWordItem">{{ nextWord.phonetic }}</div>
          <div class="nextWordItem" v-if="!optionsStore.isMeaningHidden">
            {{ nextWord.meaning }}
          </div>
        </el-card>
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
          :maxlength="currWord.word.length"
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
      :percentage="(currWordIndex / words.length) * 100"
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
                currWordIndex < words.length ? currWordIndex + 1 : currWordIndex
              }}
              / {{ words.length }}
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
import { onMounted, ref, watch } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useOptionsStore } from "../store/optionsStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const optionsStore = useOptionsStore();

const words = ref([
  {
    word: "apple",
    phonetic: "AmE: [ˈæp(ə)l]",
    sound: new Howl({ src: "src/assets/audio/apple-us.mp3" }),
    meaning: "n. 苹果公司；【植】苹果；【植】苹果树",
  },
  {
    word: "banana",
    phonetic: "AmE: [bəˈnɑːnə]",
    sound: new Howl({ src: "src/assets/audio/banana-us.mp3" }),
    meaning: "n.【食】香蕉",
  },
  {
    word: "cherry",
    phonetic: "AmE: [ˈtʃɛri]",
    sound: new Howl({ src: "src/assets/audio/cherry-us.mp3" }),
    meaning: "n.【植】樱桃；adj. 樱桃色的",
  },
  {
    word: "date",
    phonetic: "AmE: [deɪt]",
    sound: new Howl({ src: "src/assets/audio/date-us.mp3" }),
    meaning: "n. 日期，约会；v. 过时，注明日期",
  },
]);
const currWordIndex = ref(0);

const prevWord = ref({
  word: "",
  phonetic: "",
  sound: words.value[0].sound,
  meaning: "",
});
const currWord = ref({
  word: "",
  phonetic: "",
  sound: words.value[1].sound,
  meaning: "",
});
const nextWord = ref({
  word: "",
  phonetic: "",
  sound: words.value[2].sound,
  meaning: "",
});

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
const sounds = [correctSound, wrongSound, typingSound];
watch(
  () => optionsStore.volume,
  (value) => {
    sounds.forEach((sound) => sound.volume(value / 100));
    words.value.forEach((word) => word.sound.volume(optionsStore.volume / 100));
  },
  { immediate: true },
);

if (optionsStore.isWordHidden) {
  watch(
    userInput,
    (newUserInput) => {
      hiddenWord.value =
        newUserInput +
        "_ ".repeat(currWord.value.word.length - newUserInput.length);
    },
    { immediate: true },
  );
}

onMounted(() => {
  loadWord();
});

function init() {
  if (!stopWatch.isRunning.value) stopWatch.start();
}

function loadWord() {
  const emptyWord = { word: "", phonetic: "" };
  prevWord.value = words.value[currWordIndex.value - 1] || emptyWord;
  currWord.value = words.value[currWordIndex.value];
  nextWord.value = words.value[currWordIndex.value + 1] || emptyWord;

  userInput.value = "";
  isCorrect.value = false;
  hiddenWord.value = "_ ".repeat(currWord.value.word.length);

  playWordSound();
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

  if (++currWordIndex.value < words.value.length) loadWord();
  else finish();
}

function playTypingSound() {
  if (optionsStore.isSoundEnabled) typingSound.play();
}

function playWordSound() {
  if (optionsStore.isSoundEnabled) currWord.value.sound.play();
}

function checkSpelling() {
  if (userInput.value.length != currWord.value.word.length) return;

  isCorrect.value = userInput.value.toLowerCase() === currWord.value.word;
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

.result {
  margin-top: 10px;
  margin-bottom: 10px;
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

#prevWord,
#nextWord {
  width: 320px;
  margin: auto auto;
}

#prevWord {
  margin-bottom: 1em;
}

#nextWord {
  margin-top: 1em;
}

.currWordMain {
  font-size: 3em;
  font-weight: bold;
}

.prevWordMain,
.nextWordMain,
.currWordItem {
  font-size: 1.5em;
}

.prevWordItem,
.nextWordItem {
  font-size: 0.9em;
}

.speaker {
  width: 1em;
  height: 1em;
  vertical-align: middle;
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
