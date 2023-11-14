import { useLoginStore } from "../../store/loginStore";
import router from "../../router";

const loginStore = useLoginStore();

export function logout(): void {
  loginStore.userVo = null;
  loginStore.password = "";
  loginStore.avatar = "";
  localStorage.removeItem("satoken");
  router.push("/");
}
