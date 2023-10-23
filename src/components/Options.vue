<template>
  <div class="option">
    <input type="checkbox" v-model="autoNext" />
    <label>拼写正确自动切换</label>
  </div>
  <div class="option">
    <input type="checkbox" v-model="isWordHidden" />
    <label>隐藏单词</label>
  </div>
  <div class="option">
    <input type="checkbox" v-model="sound" />
    <label>启用音效</label>
  </div>
  <div class="option">
    <label id="volumeLabel">音量</label>
    <input id="volumeSlider" type="range" v-model="volume" />
  </div>
</template>

/* input: @change setVolume */

<script lang="ts">
import { defineComponent, ref } from "vue";
import { defineStore } from "pinia";

const autoNext = ref(true);
const isWordHidden = ref(false);
const sound = ref(true);
const volume = ref(50);

export default defineComponent({
  data() {
    return {
      autoNext,
      isWordHidden,
      sound,
      volume,
    };
  },
});

export const optionsStore = defineStore("options", {
  state: () => {
    return {
      autoNext,
      isWordHidden,
      sound,
      volume,
    };
  },
});
</script>

<style scoped>
.option {
  margin: 1em;
}
</style>
