<template>
  <el-card
    id="word"
    :class="{ adjWord: !isCurrWord }"
    :body-style="{ padding: '0px' }"
    v-if="word"
  >
    <template #header>
      <div :class="{ currWordMain: isCurrWord, adjWordMain: !isCurrWord }">
        <div v-if="userInput == undefined || !optionsStore.isWordHidden">
          {{ getWordMain(word) }}
        </div>
        <div v-else>
          {{ getHiddenWord(word, userInput) }}
        </div>
      </div>
    </template>
    <div :class="{ currWordItem: isCurrWord, adjWordItem: !isCurrWord }">
      <div>
        {{ getWordPhone(word) }}
        <img
          src="../assets/img/speaker.png"
          class="speaker"
          @click="playWordSound"
          v-if="isCurrWord"
        />
      </div>
      <div v-if="!optionsStore.isMeaningHidden">
        <div v-for="meaning in word.extension.meanings">
          {{ meaning }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { WordVo } from "./Dicts/common";
import {
  getWordMain,
  getWordPhone,
  playWordSound,
  getHiddenWord,
} from "./WordCard";
import { watch } from "vue";
const optionsStore = useOptionsStore();

/**
 * @param userInput - undefined if the word is previous,
 *                   the user input if the word is current,
 *                   "" if the word is next.
 */
const props = defineProps<{
  word?: WordVo;
  userInput?: string;
}>();

const emits = defineEmits<{
  (event: "done", isCorrect: boolean): void;
}>();

const isCurrWord = props.userInput != undefined && props.userInput != "";

watch(
  () => props.userInput,
  (newInput) => {
    if (newInput == undefined || !props.word) return;

    if (newInput.length == props.word.name.length) {
      // console.log(
      //   `word input done: ${newInput.toLowerCase()} === ${props.word.name}: ${
      //     newInput.toLowerCase() === props.word.name
      //   }`,
      // );
      emits("done", newInput.toLowerCase() === props.word.name);
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.adjWord {
  width: 320px;
  margin: auto auto;
}

.currWordMain {
  font-size: 3em;
  font-weight: bold;
}

.adjWordMain,
.currWordItem {
  font-size: 1.5em;
}

.adjWordItem {
  font-size: 0.9em;
}

.speaker {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>
