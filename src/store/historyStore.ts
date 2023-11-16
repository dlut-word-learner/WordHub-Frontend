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
    // 将当前词典加入RecentlyUsed，如果已经在其中则将其排到最前面
    const unShiftRecentlyUsed = (dict: DictVo): void => {
      for(const [index, x] of recentlyUsedDicts.value.entries()){
        if(dict.name == x.name &&
          dict.id == x.id &&
          dict.language == x.language){
            recentlyUsedDicts.value.splice(index);
            break;
          }
      }
      recentlyUsedDicts.value.unshift(dict);
    };
    return {
      recentlyUsedDicts,
      isRecentlyUsed,
      unShiftRecentlyUsed,
    };
  },
  {
    persist: true,
  },
);
