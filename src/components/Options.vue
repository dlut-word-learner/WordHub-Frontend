<template>
  <div class="option">
    <input type="checkbox" v-model="store.autoNext" />
    <label>拼写正确自动切换</label>
  </div>
  <div class="option">
    <input type="checkbox" v-model="store.isWordHidden" />
    <label>隐藏单词</label>
  </div>
  <div class="option">
    <input type="checkbox" v-model="store.isSoundEnabled" />
    <label>启用音效</label>
  </div>
  <div class="option">
    <label id="volumeLabel">音量</label>
    <input
      id="volumeSlider"
      type="range"
      v-model="store.volume"
      :disabled="!store.isSoundEnabled"
    />
  </div>
</template>

<script setup lang="ts">
import { optionsStore } from "../scripts/optionsStore";

const store = optionsStore();
</script>

<style scoped>
.option {
  margin: 1em;
}
</style>
