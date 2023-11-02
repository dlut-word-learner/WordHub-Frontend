<template>
  <el-card
    id="currWord"
    :body-style="{ padding: '0px' }"
    v-if="isCurrWord || (!isCurrWord && word && optionsStore.showPrevNext)"
  >
    <template #header v-if="!optionsStore.isWordHidden">
      <div :class="{ currWordMain: isCurrWord, adjWordMain: !isCurrWord }">
        {{ getWordMain(word) }}
      </div>
    </template>
    <template #header v-else>
      <div :class="{ currWordMain: isCurrWord, adjWordMain: !isCurrWord }">
        {{ hiddenWord }}
      </div>
    </template>
    <div :class="{ currWordMain: isCurrWord, adjWordMain: !isCurrWord }">
      {{ getWordPhone(word) }}
      <img
        src="../assets/img/speaker.png"
        class="speaker"
        @click="playWordSound"
        v-if="isCurrWord"
      />
    </div>
    <div
      :class="{ currWordItem: isCurrWord, adjItem: !isCurrWord }"
      v-if="!optionsStore.isMeaningHidden"
    >
      <div v-for="meaning in word?.extension.meanings">
        {{ meaning }}
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { WordVo } from "./Dicts/common";
import { getWordMain, getWordPhone, playWordSound } from "./WordCard";

const optionsStore = useOptionsStore();

defineProps<{
  isCurrWord: boolean;
  word: WordVo | null;
}>();
</script>

<style scoped>
#adjWord {
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
