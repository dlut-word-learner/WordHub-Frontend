<template>
  <div class="word-spelling-app">
    <h1>单词拼写</h1>
    <div class="word-container">
      <div class="word">
        <label id="prevWord">{{ prevWord }}</label>
        <div :class="{ shake: shake }">
          <label id="currWord">{{ currWord }}</label>
        </div>
        <label id="nextWord">{{ nextWord }}</label>
      </div>
      <input
        v-model="userInput"
        @input="checkSpelling"
        :class="{ shake: shake }"
      />
    </div>
    <div class="result">{{ wordPrompt }}</div>
    <el-button @click="goToNextWord" type="primary">下一个单词</el-button>
    <input type="checkbox" class="option" v-model="autoNext" />
    <label>拼写正确自动切换</label>
    <input type="checkbox" class="option" v-model="sound" />
    <label>音效</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElButton } from "element-plus";

const correctSound = new Audio("src/assets/audio/correct.wav");
const wrongSound = new Audio("src/assets/audio/wrong.wav");

export default defineComponent({
  components: {
    ElButton,
  },
  data() {
    return {
      words: ["apple", "banana", "cherry", "date"],
      currWordIndex: 0,
      prevWord: "",
      currWord: "",
      nextWord: "",
      userInput: "",
      wordPrompt: "",
      isCorrect: false,
      shake: false,
      autoNext: true, // Go to the next word automatically
      sound: true, // Sound effects
    };
  },
  mounted() {
    this.loadWord();
  },
  methods: {
    loadWord() {
      this.prevWord = this.words[this.currWordIndex - 1] || "";
      this.currWord = this.words[this.currWordIndex];
      this.nextWord = this.words[this.currWordIndex + 1] || "";
      this.userInput = "";
      this.wordPrompt = "";
      this.isCorrect = false;
    },
    shakeWord() {
      this.shake = true;
      setTimeout(() => (this.shake = false), 400);
    },
    checkSpelling() {
      if (this.userInput.length != this.currWord.length) return;

      this.isCorrect = this.userInput.toLowerCase() === this.currWord;
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

      this.currWordIndex++;
      if (this.currWordIndex < this.words.length) this.loadWord();
      else alert("恭喜，你已完成所有单词！");
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

.word {
  font-size: 24px;
  margin-bottom: 10px;
}

input {
  padding: 5px;
  font-size: 18px;
}

.result {
  margin-top: 10px;
}

.option {
  margin-left: 20px;
}

#prevWord {
  text-align: left;
  margin: 2.5em;
}

#currWord {
  text-align: center;
  font-size: 3em;
  font-weight: bold;
}

#nextWord {
  text-align: right;
  margin: 2.5em;
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
