import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const recentlyUsedDicts = ref<string[]>([]);
    return {
      recentlyUsedDicts,
    };
  },
  {
    persist: true,
  },
);
