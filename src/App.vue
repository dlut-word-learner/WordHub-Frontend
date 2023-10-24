<template>
  <el-menu class="menu" mode="horizontal" :router="true">
    <el-menu-item>
      <el-avatar
        class="avatar"
        src="/default-avatar.png"
        v-if="loginStore.online"
      />
      <h3>{{ loginStatus }}</h3>
    </el-menu-item>
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
.menu {
  margin-bottom: 1em;
  min-width: 640px;
}

.avatar {
  margin-right: 1em;
}
</style>
