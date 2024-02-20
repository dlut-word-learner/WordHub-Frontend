<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

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
            checkSpelling(userInput, word.name, props.lang)
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
import { isKana, toKana, toHiragana, toKatakana } from "wanakana";

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
    if (newInput) TryToEmitDone(newInput);
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

function checkSpelling(input: string, wordName: string, lang: Lang): boolean {
  // true if any matches
  if (
    lang == Lang.Japanese &&
    (toHiragana(wordName) == toHiragana(input) ||
      toKatakana(wordName) == toKatakana(input) ||
      toKana(wordName) == toKana(input))
  )
    return true;
  return input.toLowerCase() === wordName;
}

/**
 * Check whether input is done and emit if so
 */
function TryToEmitDone(newInput: string): void {
  if (newInput == undefined || !props.word) return;
  const wordName = props.word.name;

  switch (props.lang) {
    case Lang.English:
      if (newInput.length == wordName.length)
        emits("done", checkSpelling(newInput, wordName, props.lang));
      break;
    case Lang.Japanese:
      /**
       * When the last kana of the word is 'な', 'に', 'ぬ', 'ね' or 'の',
       * it is essential to wait for another letter to input.
       */

      if (isKana(toKana(newInput))) {
        // 长度没到也可以先判true，如"maqi"->"machi"。只要不作为判false的依据就行
        if (checkSpelling(newInput, wordName, props.lang)) {
          emits("done", true);
          return;
        }
        if (
          ((newInput.slice(-1) != "n" || wordName.slice(-1) == "n") &&
            toKana(newInput).length == toKana(wordName).length) ||
          newInput.length == wordName.length
        )
          emits("done", checkSpelling(newInput, wordName, props.lang));
      } else if (newInput.length == wordName.length)
        emits("done", checkSpelling(newInput, wordName, props.lang));
  }
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
  min-height: 40vh;
}
.unEmWord {
  width: 27%;
  min-height: 37vh;
}

.emWordMain {
  font-size: 40px;
  /* font-size: clamp(20px,36px,70px); */
  font-weight: bold;
  animation: zoom-in 0.5s ease;
}

.unEmWordMain {
  font-size: 26px;
  /* font-size: clamp(16px,26px,50px); */
  animation: zoom-out 0.5s ease;
}

.emWordItem {
  margin-top: 15px;
  /* font-size: 23px; */
  font-size: clamp(18px, 21px, 26px);
}

.unEmWordItem {
  margin-top: 15px;
  /* font-size: 16px; */
  font-size: clamp(14px, 18px, 22px);
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
