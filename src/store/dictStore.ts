import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useDictStore = defineStore(
  "words",
  () => {
    const id: Ref<number | null> = ref(null);
    const lang = ref("");

    return {
      id,
      lang,
    };
  },
  {
    persist: true,
  },
);
