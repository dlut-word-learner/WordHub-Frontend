import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { Howler } from "howler";
import { i18n } from "../locales";

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
    const isAnimationEnabled = ref(true);

    const volume = ref(50);
    const lang = ref(i18n.global.locale.value);

    watch(volume, (newValue) => {
      Howler.volume(newValue / 100);
    });

    watch(isSoundEnabled, (newValue) => {
      Howler.mute(!newValue);
    });

    watch(isAnimationEnabled, (enabled) => {
      document.querySelector("style[data-animation]")!.innerHTML = enabled
        ? ""
        : "* { transition: none !important; }";
    });

    return {
      learnWordsPerRound,
      reviewWordsPerRound,
      qwertyWordsPerRound,
      autoNext,
      showPrevNext,
      isWordHidden,
      isMeaningHidden,
      isSoundEnabled,
      isAnimationEnabled,
      volume,
      lang,
    };
  },
  {
    persist: true,
  },
);
