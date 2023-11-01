import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const enum DictAction {
  Learn,
  Review,
}

export const useDictStore = defineStore(
  "words",
  () => {
    const action: Ref<DictAction | null> = ref(null);
    const id: Ref<number | null> = ref(null);
    const lang = ref("");

    return {
      action,
      id,
      lang,
    };
  },
  {
    persist: true,
  },
);
