import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "../main";

export const useOptionsStore = defineStore(
  "options",
  () => {
    const learnWordsPerRound = ref(20);
    const reviewWordsPerRound = ref(20);
    const qwertyWordsPerRound = ref(20);

    const autoNext = ref(true);
    const showPrevNext = ref(true);

    const isWordHidden = ref(false);
    const isMeaningHidden = ref(false);
    const isSoundEnabled = ref(true);

    const volume = ref(50);
    const lang = ref(i18n.global.locale.value);

    return {
      learnWordsPerRound,
      reviewWordsPerRound,
      qwertyWordsPerRound,
      autoNext,
      showPrevNext,
      isWordHidden,
      isMeaningHidden,
      isSoundEnabled,
      volume,
      lang,
    };
  },
  {
    persist: true,
  },
);
