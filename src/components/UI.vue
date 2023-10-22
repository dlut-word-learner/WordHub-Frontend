<template>
  <div class="word-spelling-app">
    <h1>单词拼写</h1>
    <div class="word-container">
      <div class="words">
        <label id="prevWord">{{ prevWord.word }}</label>
        <br />
        <label id="prevWordPhone">{{ prevWord.phonetic }}</label>
        <div :class="{ shake: shake }">
          <label id="currWord">{{ currWord.word }}</label>
          <br />
          <label id="currWordPhone">{{ currWord.phonetic }}</label>
        </div>
        <label id="nextWord">{{ nextWord.word }}</label>
        <br />
        <label id="nextWordPhone">{{ nextWord.phonetic }}</label>
      </div>
      <input
        id="userInputBox"
        v-model="userInput"
        @input="checkSpelling"
        @keypress="playTypingSound"
        :class="{ shake: shake }"
      />
    </div>
    <div class="result">{{ wordPrompt }}</div>
    <el-button id="nextWordButton" @click="goToNextWord" type="primary"
      >下一个单词</el-button
    >
    <div class="option-container">
      <input type="checkbox" class="option" v-model="autoNext" />
      <label>拼写正确自动切换</label>
      <input type="checkbox" class="option" v-model="sound" />
      <label>音效</label>
      <input
        type="checkbox"
        class="option"
        v-model="isWordHidden"
        @change="hideShowWord"
      />
      <label>隐藏单词</label>
    </div>
    <div class="status-container">
      <table>
        <thead>
          <tr>
            <th>用时</th>
            <th>进度</th>
            <th>速度</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h2>
                {{
                  stopWatch.hours < 10
                    ? "0" + stopWatch.hours
                    : stopWatch.hours
                }}:{{
                  stopWatch.minutes < 10
                    ? "0" + stopWatch.minutes
                    : stopWatch.minutes
                }}:{{
                  stopWatch.seconds < 10
                    ? "0" + stopWatch.seconds
                    : stopWatch.seconds
                }}
              </h2>
            </td>
            <td>
              <h2>{{ currWordIndex + 1 }} / {{ words.length }}</h2>
            </td>
            <td>
              <h2>
                {{
                  (
                    currWordIndex /
                    (stopWatch.hours * 60 +
                      stopWatch.minutes +
                      stopWatch.seconds / 60)
                  ).toFixed(0)
                }}
                WPM
              </h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElButton } from "element-plus";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";

const correctSound = new Howl({ src: "src/assets/audio/correct.wav" });
const wrongSound = new Howl({ src: "src/assets/audio/wrong.wav" });
const typingSound = new Howl({ src: "src/assets/audio/typing.wav" });

export default defineComponent({
  components: {
    ElButton,
  },
  data() {
    return {
      words: [
        { word: "apple", phonetic: "[ˈæp(ə)l]" },
        { word: "banana", phonetic: "[bəˈnɑːnə]" },
        { word: "cherry", phonetic: "[ˈtʃɛri]" },
        { word: "date", phonetic: "[deɪt]" },
      ],
      currWordIndex: 0,
      prevWord: { word: "", phonetic: "" },
      currWord: { word: "", phonetic: "" },
      nextWord: { word: "", phonetic: "" },
      userInput: "",
      wordPrompt: "",
      isCorrect: false,
      shake: false,
      autoNext: true, // Go to the next word automatically
      sound: true, // Sound effects
      isWordHidden: false,
      stopWatch: useStopwatch(0, false),
    };
  },
  mounted() {
    this.loadWord();
    this.wordPrompt = "键入以开始";

    const userInputBox = document.getElementById("userInputBox");
    userInputBox?.addEventListener("keydown", this.init);
  },
  methods: {
    init() {
      this.wordPrompt = "";
      this.stopWatch.start();
      const userInputBox = document.getElementById("userInputBox");
      userInputBox?.removeEventListener("keydown", this.init);
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
      if (this.sound) typingSound.play();
    },
    checkSpelling() {
      if (this.userInput.length != this.currWord.word.length) return;

      this.isCorrect = this.userInput.toLowerCase() === this.currWord.word;
      if (this.isCorrect) {
        this.wordPrompt = "拼写正确！";
        if (this.sound) correctSound.play();
        if (this.autoNext) setTimeout(this.goToNextWord, 500);
      } else {
        this.wordPrompt = "拼写错误，请继续尝试。";
        this.shakeWord();
        if (this.sound) wrongSound.play();
        this.userInput = "";
      }
    },
    goToNextWord() {
      if (!this.isCorrect)
        if (!confirm("当前单词尚未拼写正确，确定要切换到下一个单词吗？"))
          return;

      if (++this.currWordIndex < this.words.length) this.loadWord();
      else this.finish();
    },
    hideShowWord() {
      const words = [
        document?.getElementById("prevWord") as HTMLLabelElement,
        document?.getElementById("currWord") as HTMLLabelElement,
        document?.getElementById("nextWord") as HTMLLabelElement,
      ];

      if (this.isWordHidden)
        words.forEach((word) => (word.style.display = "none"));
      else words.forEach((word) => (word.style.display = ""));
    },
    finish() {
      this.currWordIndex = this.words.length - 1;
      this.stopWatch.pause();
      const userInputBox = document?.getElementById(
        "userInputBox",
      ) as HTMLInputElement;
      userInputBox.disabled = true;

      const nextWordButton = document?.getElementById(
        "nextWordButton",
      ) as HTMLButtonElement;
      nextWordButton.disabled = true;

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

.status-container {
  margin-top: 10px;
}

table {
  width: 100%;
}

th,
td {
  padding: 0.5em;
  width: 33.33%;
}

th {
  border-bottom: 1px solid #ddd;
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
