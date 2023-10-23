//引入路由对象
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

//vue2 mode history vue3 createWebHistory
//vue2 mode  hash  vue3  createWebHashHistory
//vue2 mode abstact vue3  createMemoryHistory

//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//导出router
export default router;
