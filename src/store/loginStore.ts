import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserVo {
  id: number;
  username: string;
  email: string;
  score: number;
  role: number;
}

export const useLoginStore = defineStore(
  "login",
  () => {
    const userVo = {
      id: ref(0),
      username: ref(""),
      email: ref(""),
      score: ref(0),
      role: ref(0),
    };

    const password = ref("");
    const online = ref(false);

    return {
      userVo,
      password,
      online,
    };
  },
  {
    persist: true,
  },
);
