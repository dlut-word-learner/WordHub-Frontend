import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "../main";

export const useOptionsStore = defineStore(
  "options",
  () => {
    const autoNext = ref(true);
    const showPrevNext = ref(true);
    const isWordHidden = ref(false);
    const isSoundEnabled = ref(true);
    const volume = ref(50);
    const lang = ref(i18n.global.locale.value);

    function setLang() {
      i18n.global.locale.value = lang.value;
    }

    return {
      autoNext,
      showPrevNext,
      isWordHidden,
      isSoundEnabled,
      volume,
      lang,
      setLang,
    };
  },
  {
    persist: true,
  },
);
