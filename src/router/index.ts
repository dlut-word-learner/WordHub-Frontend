import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useLoginStore } from "../store/loginStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: () => {
      const loginStore = useLoginStore();
      return loginStore.userVo ? "/dicts" : "/login";
    },
  },
  {
    path: "/login",
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
    path: "/Chart",
    name: "Chart",
    component: () => import("../components/Chart/Chart.vue"),
  },
  {
    path: "/Contactus",
    name: "Contactus",
    component: () => import("../components/Contactus/Contactus.vue"),
  },
  {
    path: "/learn",
    name: "Learn",
    component: () => import("../components/Learn.vue"),
    props: (router) => ({
      lang: router.query.lang,
      dictId: router.query.dictId,
      num: router.query.num,
    }),
  },
  {
    path: "/review",
    name: "Review",
    component: () => import("../components/Review.vue"),
    props: (router) => ({
      lang: router.query.lang,
      dictId: router.query.dictId,
      num: router.query.num,
    }),
  },
  {
    path: "/qwerty-mode",
    name: "QwertyMode",
    component: () => import("../components/QwertyMode.vue"),
    props: (router) => ({
      lang: router.query.lang,
      dictId: router.query.dictId,
      num: router.query.num,
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
