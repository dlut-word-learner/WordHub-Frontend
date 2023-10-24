<template>
  <el-menu mode="horizontal" :router="true">
    <el-menu-item>{{ loginStatus }}</el-menu-item>
    <el-menu-item index="/">登录</el-menu-item>
    <el-menu-item index="UI">UI</el-menu-item>
    <el-menu-item index="Options">选项</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { watchEffect, ref } from "vue";
import { useLoginStore } from "./scripts/loginStore";

const loginStore = useLoginStore();
const loginStatus = ref("未登录");

watchEffect(() => {
  if (loginStore.online) loginStatus.value = loginStore.username;
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding-right: 10px;
}

#nav a:not(:first-child) {
  border-left: 1px solid #2c3e50;
  padding-left: 30px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
