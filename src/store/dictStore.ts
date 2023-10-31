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
    const dictId: Ref<number | null> = ref(null);
    const dictLang = ref("");

    return {
      action,
      dictId,
      dictLang,
    };
  },
  {
    persist: true,
  },
);
