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
    name: "Dicts",
    component: () => import("../components/Dicts/Dicts.vue"),
    children: [
      {
        path: "all",
        name: "All",
        component: () => import("../components/Dicts/all.vue"),
      },
      {
        path: "en",
        name: "English",
        component: () => import("../components/Dicts/en.vue"),
      },
      {
        path: "ja",
        name: "Japanese",
        component: () => import("../components/Dicts/ja.vue"),
      },
    ],
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
      {
        path: "delete-user",
        component: () => import("../components/UserInfo/DeleteUser.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
