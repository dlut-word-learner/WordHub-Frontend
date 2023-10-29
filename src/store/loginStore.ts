import { defineStore } from "pinia";
import { Ref, ref } from "vue";

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
    const userVo: Ref<UserVo | null> = ref(null);
    const password = ref("");

    return {
      userVo,
      password,
    };
  },
  {
    persist: true,
  },
);
