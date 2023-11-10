import { defineStore } from "pinia";
import { reactive } from "vue";
import { DictVo, includesDict } from "../components/Dicts/common";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const recentlyUsedDicts = reactive(Array<DictVo>());
    const isRecentlyUsed = (dict: DictVo): boolean => {
      return includesDict(recentlyUsedDicts, dict);
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
