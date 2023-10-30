import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export interface UserVo {
  id: number;
  username: string;
  email: string;
  score: number;
  role: number; // 0 -> Users; 1 -> Administrators
}

export const useLoginStore = defineStore(
  "login",
  () => {
    const userVo: Ref<UserVo | null> = ref(null);
    const password = ref("");
    const avatar = ref("");

    return {
      userVo,
      password,
      avatar,
    };
  },
  {
    persist: true,
  },
);
