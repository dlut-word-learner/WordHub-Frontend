// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
