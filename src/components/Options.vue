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
    <input type="checkbox" v-model="store.sound" />
    <label>启用音效</label>
  </div>
  <div class="option">
    <label id="volumeLabel">音量</label>
    <input id="volumeSlider" type="range" v-model="store.volume" />
  </div>
</template>

/* input: @change setVolume */

<script lang="ts">
import { defineComponent} from "vue";
import { defineStore } from "pinia";

export default defineComponent({
  setup() {
    const store = optionsStore();
    return {
      store
    };
  },
});

export const optionsStore = defineStore("options", {
  state: () => {
    return {
      autoNext: true,
      isWordHidden: false,
      sound: true,
      volume: 50,
    };
  },
  persist: true,
});
</script>

<style scoped>
.option {
  margin: 1em;
}
</style>
