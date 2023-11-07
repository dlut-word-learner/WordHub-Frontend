import { defineStore } from "pinia";
import { ref, watch } from "vue";

export enum Task {
  Learn,
  Review,
  QwertyMode,
  None,
}

export const useTaskStore = defineStore(
  "task",
  () => {
    const type = ref(Task.None);
    const url = ref("");
    watch(type, (newType) => {
      if (newType == Task.None) url.value = "";
    });
    return {
      type,
      url,
    };
  },
  // {
  //   persist: true,
  // },
);
