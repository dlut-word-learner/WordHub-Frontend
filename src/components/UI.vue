<template>
  <div class="word-spelling-app">
    <h1>单词拼写</h1>
    <div class="word-container">
      <div class="words">
        <label id="prevWord" v-if="!store.isWordHidden">
          {{ prevWord.word }}
        </label>
        <br />
        <label id="prevWordPhone">{{ prevWord.phonetic }}</label>
        <div :class="{ shake: shake }">
          <label id="currWord" v-if="!store.isWordHidden">
            {{ currWord.word }}
          </label>
          <br />
          <label id="currWordPhone">{{ currWord.phonetic }}</label>
        </div>
        <label id="nextWord" v-if="!store.isWordHidden">
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
        @keydown="if (!stopWatch.isRunning) init();"
        :class="{ shake: shake }"
        :disabled="isFinished"
      />
    </div>
    <div class="result">{{ wordPrompt }}</div>
    <el-button
      id="nextWordButton"
      type="primary"
      @click="goToNextWord"
      :disabled="!stopWatch.isRunning"
    >
      下一个单词
    </el-button>
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
                stopWatch.hours < 10 ? "0" + stopWatch.hours : stopWatch.hours
              }}:{{
                stopWatch.minutes < 10
                  ? "0" + stopWatch.minutes
                  : stopWatch.minutes
              }}:{{
                stopWatch.seconds < 10
                  ? "0" + stopWatch.seconds
                  : stopWatch.seconds
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
                  (stopWatch.hours * 60 +
                    stopWatch.minutes +
                    stopWatch.seconds / 60)
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
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { optionsStore } from "./Options.vue";

const correctSound = new Howl({ src: "src/assets/audio/correct.wav" });
const wrongSound = new Howl({ src: "src/assets/audio/wrong.wav" });
const typingSound = new Howl({ src: "src/assets/audio/typing.wav" });
const sounds = [correctSound, wrongSound, typingSound];

export default defineComponent({
  components: {
    ElButton,
  },
  setup() {
    const store = optionsStore();
    watchEffect(() => {
      sounds.forEach((sound) => sound.volume(store.volume / 100));
    });
    return {
      store,
    };
  },
  data() {
    return {
      words: [
        { word: "apple", phonetic: "AmE: [ˈæp(ə)l]" },
        { word: "banana", phonetic: "AmE: [bəˈnɑːnə]" },
        { word: "cherry", phonetic: "AmE: [ˈtʃɛri]" },
        { word: "date", phonetic: "AmE: [deɪt]" },
      ],
      currWordIndex: 0,
      prevWord: { word: "", phonetic: "" },
      currWord: { word: "", phonetic: "" },
      nextWord: { word: "", phonetic: "" },
      tries: 0,
      userInput: "",
      wordPrompt: "",
      isCorrect: false,
      isFinished: false,
      shake: false,
      stopWatch: useStopwatch(0, false),
    };
  },
  mounted() {
    this.loadWord();
    this.wordPrompt = "键入以开始";
  },
  methods: {
    init() {
      this.wordPrompt = "";
      this.stopWatch.start();
    },
    loadWord() {
      const emptyWord = { word: "", phonetic: "" };
      this.prevWord = this.words[this.currWordIndex - 1] || emptyWord;
      this.currWord = this.words[this.currWordIndex];
      this.nextWord = this.words[this.currWordIndex + 1] || emptyWord;

      this.userInput = "";
      this.wordPrompt = "";
      this.isCorrect = false;
    },
    shakeWord() {
      this.shake = true;
      setTimeout(() => (this.shake = false), 400);
    },
    playTypingSound() {
      if (this.store.isSoundEnabled) typingSound.play();
    },
    checkSpelling() {
      if (this.userInput.length != this.currWord.word.length) return;

      this.isCorrect = this.userInput.toLowerCase() === this.currWord.word;
      if (this.isCorrect) {
        this.wordPrompt = "拼写正确！";
        if (this.store.isSoundEnabled) correctSound.play();
        if (this.store.autoNext) setTimeout(this.goToNextWord, 500);
      } else {
        this.wordPrompt = "拼写错误，请继续尝试。";
        this.shakeWord();
        if (this.store.isSoundEnabled) wrongSound.play();
        this.tries++;
        this.userInput = "";
      }
    },
    goToNextWord() {
      if (!this.isCorrect)
        if (!confirm("当前单词尚未拼写正确，确定要切换到下一个单词吗？"))
          return;

      if (++this.currWordIndex < this.words.length) {
        this.tries++;
        this.loadWord();
      } else this.finish();
    },
    finish() {
      this.isFinished = true;
      this.stopWatch.pause();
      alert("恭喜，你已完成所有单词！");
    },
  },
});
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
