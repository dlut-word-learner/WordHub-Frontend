import { useUserStore } from "../../store/userStore";
import router from "../../router";

const userStore = useUserStore();

export function logout(): void {
  userStore.userVo = null;
  userStore.password = "";
  userStore.avatar = "";
  localStorage.removeItem("satoken");
  router.push("/");
}
