import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserVo {
  id: string;
  username: string;
  email: string;
  score: number;
  role: number;
}

export const useLoginStore = defineStore(
  "login",
  () => {
    const userVo = {
      id: ref(""),
      username: ref(""),
      email: ref(""),
      score: ref(0),
      role: ref(0),
    };

    const online = ref(false);

    return {
      userVo,
      online,
    };
  },
  {
    persist: true,
  },
);
