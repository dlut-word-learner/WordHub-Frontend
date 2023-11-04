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
  },
  {
    path: "/learn",
    name: "Learn",
    component: () => import("../components/Learn.vue"),
  },
  {
    path: "/review",
    name: "Review",
    component: () => import("../components/Review.vue"),
  },
  {
    path: "/qwerty-mode/:lang/:dictId",
    name: "QwertyMode",
    component: () => import("../components/QwertyMode.vue"),
    props: router => ({
      lang: router.params.lang,
      dictId: router.params.dictId,
      num: router.query.num
    }),
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
