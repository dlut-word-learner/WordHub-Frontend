import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const enum Task {
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

    return {
      type,
      url,
    };
  },
  // {
  //   persist: true,
  // },
);
