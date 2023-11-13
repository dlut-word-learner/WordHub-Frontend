import { defineStore } from "pinia";
import { ref } from "vue";
import { DictVo, includesDict } from "../components/Dicts/common";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const recentlyUsedDicts = ref(Array<DictVo>());
    const isRecentlyUsed = (dict: DictVo): boolean => {
      return includesDict(recentlyUsedDicts.value, dict);
    };
    return {
      recentlyUsedDicts,
      isRecentlyUsed,
    };
  },
  {
    persist: true,
  },
);
