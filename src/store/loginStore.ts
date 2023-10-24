import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginStore = defineStore(
  "login",
  () => {
    const username = ref("");
    const password = ref("");
    const online = ref(false);

    return {
      username,
      password,
      online,
    };
  },
  {
    persist: true,
  },
);
