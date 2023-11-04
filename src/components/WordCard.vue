<template>
  <el-card
    id="word"
    :class="{ word: !emphasized }"
    :body-style="{ padding: '0px' }"
  >
    <template #header>
      <div :class="{ emWordMain: emphasized, wordMain: !emphasized }">
        <div
          v-if="
            userInput == undefined ||
            !optionsStore.isWordHidden ||
            checkSpelling(userInput, word.name)
          "
        >
          {{ getWordMain(word, lang) }}
        </div>
        <div v-else>
          {{ getHiddenWord(word, userInput, lang) }}
        </div>
      </div>
    </template>
    <div :class="{ emWordItem: emphasized, wordItem: !emphasized }">
      <div>
        {{ getWordPhone(word, lang) }}
        <img
          src="../assets/img/speaker.png"
          class="speaker"
          @click="sound?.play()"
          v-if="optionsStore.isSoundEnabled && sound"
        />
      </div>
      <div v-if="!optionsStore.isMeaningHidden">
        <div class="meaning" v-for="meaning in word.extension.meanings">
          {{ meaning }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { WordVo } from "./Dicts/common";
import { getWordMain, getWordPhone, getHiddenWord } from "./WordCard";
import { watch } from "vue";

const optionsStore = useOptionsStore();

const props = defineProps<{
  word: WordVo;
  /** language of the word */
  lang: string;
  /** sound of the word, which can be played when sound is enabled */
  sound?: Howl;

  emphasized?: boolean;
  /** undefined if the word is previous,<br/>
   *  the user input if the word is current,<br/>
   *  "" if the word is next. */
  userInput?: string;
}>();

const emits = defineEmits<{
  (event: "done", isCorrect: boolean): void;
}>();

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
      emits("done", checkSpelling(newInput, props.word.name));
    }
  },
  {
    immediate: true,
  },
);

function checkSpelling(input: string, wordName: string): boolean {
  return input.toLowerCase() === wordName;
}
</script>

<style scoped>
.word {
  width: 320px;
  margin: auto auto;
}

.emWordMain {
  font-size: 3em;
  font-weight: bold;
}

.wordMain,
.emWordItem {
  font-size: 1.5em;
}

.wordItem {
  font-size: 0.9em;
}

.meaning {
  margin-left: 1em;
  margin-right: 1em;
}

.speaker {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>
