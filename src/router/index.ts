import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/UI",
    name: "UI",
    component: () => import("../components/UI.vue"),
  },
  {
    path: "/Options",
    name: "Options",
    component: () => import("../components/Options.vue"),
  },
  {
    path: "/UserInfo",
    name: "UserInfo",
    component: () => import("../components/UserInfo.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
