<template>
  <el-menu class="menu" mode="horizontal" :router="true">
    <el-sub-menu index="2" v-if="loginStore.online">
      <template #title>
        <el-avatar
          class="avatar"
          src="/default-avatar.png"
          v-if="loginStore.online"
        />
        {{ loginStore.online ? loginStore.username : $t("app.loggedOut") }}
      </template>
      <el-menu-item @click="logout">{{ $t("app.logout") }}</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/" v-if="!loginStore.online">{{
      $t("app.login")
    }}</el-menu-item>
    <el-menu-item index="UI">{{ $t("app.ui") }}</el-menu-item>
    <el-menu-item index="Options">{{ $t("app.options") }}</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useLoginStore } from "./store/loginStore";

const loginStore = useLoginStore();

function logout() {
  loginStore.online = false;
  loginStore.username = "";
  loginStore.password = "";
}
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
