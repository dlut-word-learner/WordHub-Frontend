import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export interface UserVo {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly score: number;
  readonly role: number; // 0 -> Users; 1 -> Administrators
}

export const useUserStore = defineStore(
  "user",
  () => {
    const userVo: Ref<UserVo | null> = ref(null);
    const password = ref("");
    const avatar = ref("");
    const logout = ():void =>{
      userVo.value = null;
      password.value = "";
      avatar.value = "";
    }

    return {
      userVo,
      password,
      avatar,
      logout,
    };
  },
  {
    persist: {
      paths: ['userVo', 'password'],
    }
  },
);
