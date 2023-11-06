<template>
  <el-card
    class="word-card"
    :class="{ emWord: emphasized, unEmWord: !emphasized }"
    :body-style="{ padding: '0px' }"
  >
    <template #header>
      <div class="wordMain">
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
    <div class="wordItem">
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
import { Lang } from "./Dicts/common";
import { isRomaji, isKana, toKana } from "wanakana";

const optionsStore = useOptionsStore();

const props = defineProps<{
  word: WordVo;
  /** language of the word */
  lang: Lang;
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
    switch (props.lang) {
      case Lang.English:
        if (newInput.length == props.word.name.length)
          emits("done", checkSpelling(newInput, props.word.name));
        break;
      case Lang.Japanese:
        console.debug(
          `${newInput} isRomaji: ${isRomaji(newInput)}, ${toKana(newInput)
            .split("")
            .filter((x) => isKana(x))
            .join("")}: ${
            toKana(newInput)
              .split("")
              .filter((x) => isKana(x))
              .join("").length
          }, ${toKana(props.word.name)}: ${toKana(props.word.name).length}`,
        );
        if (isRomaji(newInput)) {
          if (
            toKana(newInput)
              .split("")
              .filter((x) => isKana(x))
              .join("").length == toKana(props.word.name).length
          ) {
            emits("done", checkSpelling(newInput, props.word.name));
          }
        } else {
          if (newInput.length == props.word.name.length)
            emits("done", checkSpelling(newInput, props.word.name));
        }
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => props.sound,
  (newSound) => {
    if (newSound) newSound.play();
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
.word-card {
  padding: 10px;
  transition: all 0.5s ease;
}
.emWord {
  width: 39%;
  min-height: 400px;
}
.unEmWord {
  width: 29%;
  min-height: 350px;
}

.wordMain {
  font-size: 48px;
  font-weight: bold;
}

.meaning {
  margin-left: 1em;
  margin-right: 1em;
}

.wordItem {
  margin: 15px;
  font-size: 1.5em;
}

.speaker {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}

img:hover {
  cursor: pointer;
}
</style>
