<template>
  <div class="word-spelling-app">
    <h1>单词拼写</h1>
    <div class="word-container" v-if="!isFinished">
      <div class="words">
        <label id="prevWord" v-if="!optionsStore.isWordHidden">
          {{ prevWord.word }}
        </label>
        <br />
        <label id="prevWordPhone">{{ prevWord.phonetic }}</label>
        <div :class="{ shake: shake }">
          <label id="currWord" v-if="!optionsStore.isWordHidden">
            {{ currWord.word }}
          </label>
          <br />
          <label id="currWordPhone">{{ currWord.phonetic }}</label>
        </div>
        <label id="nextWord" v-if="!optionsStore.isWordHidden">
          {{ nextWord.word }}
        </label>
        <br />
        <label id="nextWordPhone">{{ nextWord.phonetic }}</label>
      </div>
      <input
        id="userInputBox"
        v-model="userInput"
        @input="checkSpelling"
        @keypress="playTypingSound"
        @keydown="if (!stopWatch.isRunning.value) init();"
        :class="{ shake: shake }"
        :disabled="isFinished"
      />
    </div>
    <div v-if="isFinished">
      <el-result icon="success" title="恭喜，你已完成所有单词！"> </el-result>
    </div>
    <div class="result" v-if="!isFinished">{{ wordPrompt }}</div>
    <el-button
      id="nextWordButton"
      type="primary"
      @click="promptGoToNextWord"
      :disabled="!stopWatch.isRunning"
      v-if="!isFinished"
    >
      下一个单词
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
            <th>用时</th>
            <th>进度</th>
            <th>速度</th>
            <th>正确率</th>
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
                  currWordIndex /
                  (stopWatch.hours.value * 60 +
                    stopWatch.minutes.value +
                    stopWatch.seconds.value / 60)
                ).toFixed(0)
              }}
              WPM
            </td>
            <td>
              {{
                currWordIndex > tries
                  ? "100.00"
                  : ((currWordIndex / tries) * 100).toFixed(2)
              }}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog v-model="confirmVisible" title="提示" width="30%">
      <span>当前单词尚未拼写正确，确定要切换到下一个单词吗？</span>
      <template #footer>
        <span>
          <el-button @click="confirmVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="
              confirmVisible = false;
              goToNextWord();
            "
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, ref } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useOptionsStore } from "../scripts/optionsStore";

const optionsStore = useOptionsStore();

const words = ref([
  { word: "apple", phonetic: "AmE: [ˈæp(ə)l]" },
  { word: "banana", phonetic: "AmE: [bəˈnɑːnə]" },
  { word: "cherry", phonetic: "AmE: [ˈtʃɛri]" },
  { word: "date", phonetic: "AmE: [deɪt]" },
]);
const currWordIndex = ref(0);
const prevWord = ref({ word: "", phonetic: "" });
const currWord = ref({ word: "", phonetic: "" });
const nextWord = ref({ word: "", phonetic: "" });
const tries = ref(0);
const userInput = ref("");
const wordPrompt = ref("");
const isCorrect = ref(false);
const isFinished = ref(false);
const shake = ref(false);
const stopWatch = useStopwatch(0, false);

const confirmVisible = ref(false);

const correctSound = new Howl({ src: "src/assets/audio/correct.wav" });
const wrongSound = new Howl({ src: "src/assets/audio/wrong.wav" });
const typingSound = new Howl({ src: "src/assets/audio/typing.wav" });
const sounds = [correctSound, wrongSound, typingSound];
watchEffect(() => {
  sounds.forEach((sound) => sound.volume(optionsStore.volume / 100));
});

onMounted(() => {
  loadWord();
  wordPrompt.value = "键入以开始";
});

function init() {
  wordPrompt.value = "";
  stopWatch.start();
}

function loadWord() {
  const emptyWord = { word: "", phonetic: "" };
  prevWord.value = words.value[currWordIndex.value - 1] || emptyWord;
  currWord.value = words.value[currWordIndex.value];
  nextWord.value = words.value[currWordIndex.value + 1] || emptyWord;

  userInput.value = "";
  wordPrompt.value = "";
  isCorrect.value = false;
}

function shakeWord() {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord() {
  if (!isCorrect.value) confirmVisible.value = true;
}

function goToNextWord() {
  if (++currWordIndex.value < words.value.length) {
    tries.value++;
    loadWord();
  } else finish();
}

function playTypingSound() {
  if (optionsStore.isSoundEnabled) typingSound.play();
}

function checkSpelling() {
  if (userInput.value.length != currWord.value.word.length) return;

  isCorrect.value = userInput.value.toLowerCase() === currWord.value.word;
  if (isCorrect.value) {
    wordPrompt.value = "拼写正确！";
    if (optionsStore.isSoundEnabled) correctSound.play();
    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
  } else {
    wordPrompt.value = "拼写错误，请继续尝试。";
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
  margin: 20px;
  font-family: Arial, sans-serif;
}

.word-container {
  margin: 20px;
}

.words {
  font-size: 24px;
  margin-bottom: 10px;
}

input {
  padding: 5px;
  font-size: 18px;
}

.result {
  margin-top: 10px;
  margin-bottom: 10px;
}

.option-container {
  margin-top: 10px;
}
.option {
  margin-left: 20px;
}

#volumeLabel {
  margin-left: 20px;
}

#volumeSlider {
  width: 8em;
  padding-top: 0px;
  vertical-align: bottom;
}

#progressBar {
  margin-top: 1em;
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
  margin: 2.5em;
}

#currWord {
  font-size: 3em;
  font-weight: bold;
}

#prevWordPhone,
#nextWordPhone {
  font-size: 0.6em;
}

#currWordPhone {
  font-size: 1.5em;
  font-weight: bold;
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
