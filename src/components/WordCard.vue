<template>
  <el-card
    class="word-card"
    :class="{ emWord: emphasized, unEmWord: !emphasized }"
    :body-style="{ padding: '0px' }"
  >
    <template #header>
      <div :class="{ emWordMain: emphasized, unEmWordMain: !emphasized }">
        <div
          v-if="
            userInput == undefined ||
            (isMainShown != undefined
              ? isMainShown[1]
              : !optionsStore.isWordHidden) ||
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
    <div :class="{ emWordItem: emphasized, unEmWordItem: !emphasized }">
      <div v-if="isPhoneShown?.[1] != false">
        {{ getWordPhone(word, lang) }}
        <img
          alt="speak"
          src="../assets/img/speaker.png"
          class="speaker"
          @click="sound?.play()"
          v-if="optionsStore.isSoundEnabled && sound"
        />
      </div>
      <div
        v-if="
          isMeaningShown != undefined
            ? isMeaningShown?.[1]
            : !optionsStore.isMeaningHidden
        "
      >
        <div class="meaning" v-for="meaning in word.extension.meanings">
          {{ meaning }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { WordVo, Lang } from "./Dicts/common";
import { getWordMain, getWordPhone, getHiddenWord } from "./WordCard";
import { watch } from "vue";
import { isKana, toKana } from "wanakana";

const optionsStore = useOptionsStore();

const props = defineProps<{
  word: WordVo;
  /** language of the word */
  lang: Lang;
  /** sound of the word, which can be played when sound is enabled */
  sound?: Howl;

  /** Use tuple to avoid fallback to false instead of undefined */
  isMainShown?: [any, boolean];
  isMeaningShown?: [any, boolean];
  isPhoneShown?: [any, boolean];
  isInitialShown?: [any, boolean];

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
        if (isKana(toKana(newInput))) {
          if (toKana(newInput).length == toKana(props.word.name).length)
            emits("done", checkSpelling(newInput, props.word.name));
        } else if (newInput.length == props.word.name.length)
          emits("done", checkSpelling(newInput, props.word.name));
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
  /* background-color: #d9ecff; */
}
html.dark .word-card {
  /* background-color: #1c1c1c; */
}

.emWord {
  width: 41%;
  min-height: 400px;
}
.unEmWord {
  width: 27%;
  min-height: 350px;
}

.emWordMain {
  font-size: 40px;
  font-weight: bold;
  animation: zoom-in 0.5s ease;
}

.unEmWordMain {
  font-size: 26px;
  animation: zoom-out 0.5s ease;
}

.emWordItem {
  margin-top: 15px;
  font-size: 26px;
}

.unEmWordItem {
  margin-top: 15px;
  font-size: 18px;
}

@keyframes zoom-in {
  0% {
    font-size: 26px;
  }
  100% {
    font-size: 40px;
  }
}

@keyframes zoom-out {
  0% {
    font-size: 40px;
  }
  100% {
    font-size: 26px;
  }
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
