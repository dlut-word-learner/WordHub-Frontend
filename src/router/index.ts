// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "../store/userStore";
import { i18n } from "../locales";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: () => {
      const userStore = useUserStore();
      return userStore.userVo ? "/dicts" : "/login";
    },
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/dicts",
    name: "Dicts",
    component: () => import("../components/Dicts/Dicts.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/Chart",
    name: "Chart",
    component: () => import("../components/Chart/Chart.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: () => import("../components/AboutUs/AboutUs.vue"),
    meta: { requiresAuth: false },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    // 支持游客进行Qwerty
    meta: { requiresAuth: false },
  },
  {
    path: "/options",
    name: "Options",
    component: () => import("../components/Options.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: () => import("../components/UserInfo/UserInfo.vue"),
    children: [
      {
        path: "basic",
        component: () => import("../components/UserInfo/Basic.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "change-pwd",
        component: () => import("../components/UserInfo/ChangePwd.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "change-avatar",
        component: () => import("../components/UserInfo/ChangeAvatar.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "delete-user",
        component: () => import("../components/UserInfo/DeleteUser.vue"),
        meta: { requiresAuth: true },
      },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !useUserStore().userVo) {
    // 如果需要身份验证并且用户未经身份验证，则重定向到登录页面
    ElMessage.warning(i18n.global.t("loginFirst"));
    next("Login");
  } else {
    // 否则继续前往目标路由
    next();
  }
});

export default router;
