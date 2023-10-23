import { defineStore } from "pinia";
import { ref } from "vue";

export const optionsStore = defineStore(
  "options",
  () => {
    const autoNext = ref(true);
    const isWordHidden = ref(false);
    const isSoundEnabled = ref(true);
    const volume = ref(50);

    return {
      autoNext,
      isWordHidden,
      isSoundEnabled,
      volume,
    };
  },
  {
    persist: true,
  },
);
