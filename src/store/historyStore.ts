import { defineStore } from "pinia";
import { ref } from "vue";
import { DictVo } from "../components/Dicts/common";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const recentlyUsedDicts = ref<DictVo[]>([]);
    return {
      recentlyUsedDicts,
    };
  },
  {
    persist: true,
  },
);
