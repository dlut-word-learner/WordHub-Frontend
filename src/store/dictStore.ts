import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const enum DictAction {
  Learn,
  Review,
}

export const useDictStore = defineStore(
  "words",
  () => {
    const dictId: Ref<number | null> = ref(null);
    const action: Ref<DictAction | null> = ref(null);

    return {
      dictId,
      action,
    };
  },
  {
    persist: true,
  },
);
