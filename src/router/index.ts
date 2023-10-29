import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
  },
  {
    path: "/dicts",
    name: "Dict",
    component: () => import("../components/Dict.vue"),
  },
  {
    path: "/ui",
    name: "UI",
    component: () => import("../components/UI.vue"),
  },
  {
    path: "/options",
    name: "Options",
    component: () => import("../components/Options.vue"),
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: () => import("../components/UserInfo/UserInfo.vue"),
    children: [
      {
        path: "basic",
        component: () => import("../components/UserInfo/Basic.vue"),
      },
      {
        path: "change-pwd",
        component: () => import("../components/UserInfo/ChangePwd.vue"),
      },
      {
        path: "change-avatar",
        component: () => import("../components/UserInfo/ChangeAvatar.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
