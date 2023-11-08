import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export interface UserVo {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly score: number;
  readonly role: number; // 0 -> Users; 1 -> Administrators
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
