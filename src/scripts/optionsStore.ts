import { defineStore } from "pinia";
import { ref } from "vue";

export const useOptionsStore = defineStore(
  "options",
  () => {
    const autoNext = ref(true);
    const isWordHidden = ref(false);
    const isSoundEnabled = ref(true);
    const volume = ref(50);
    const lang = ref("简体中文");

    return {
      autoNext,
      isWordHidden,
      isSoundEnabled,
      volume,
      lang,
    };
  },
  {
    persist: true,
  },
);
