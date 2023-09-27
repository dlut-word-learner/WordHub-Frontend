<template>
  <div class="word-spelling-app">
    <h1>单词拼写</h1>
    <div class="word-container">
      <div class="word">{{ currentWord }}</div>
      <input v-model="userInput" @input="checkSpelling" />
    </div>
    <div class="result">
      <p v-if="isCorrect">拼写正确！</p>
      <p v-else>拼写错误，请继续尝试。</p>
    </div>
    <el-button @click="nextWord" type="primary">下一个单词</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { ElButton } from 'element-plus';

export default defineComponent({
  components: {
    ElButton,
  },
  data() {
    return {
      words: ['apple', 'banana', 'cherry', 'date'],
      currentWordIndex: 0,
      currentWord: '',
      userInput: '',
      isCorrect: false,
    };
  },
  mounted() {
    this.loadWord();
  },
  methods: {
    loadWord() {
      this.currentWord = this.words[this.currentWordIndex];
      this.userInput = '';
      this.isCorrect = false;
    },
    checkSpelling() {
      this.isCorrect = this.userInput.toLowerCase() === this.currentWord;
    },
    nextWord() {
      this.currentWordIndex++;
      if (this.currentWordIndex < this.words.length) {
        this.loadWord();
      } else {
        alert('恭喜，你已完成所有单词！');
      }
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
</style>
