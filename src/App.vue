<template>
  <el-menu class="menu" mode="horizontal" :router="true">
    <el-menu-item>
      <el-avatar
        class="avatar"
        src="/default-avatar.png"
        v-if="loginStore.online"
      />
      <h3>
        {{ loginStore.online ? loginStore.username : $t("app.loggedOut") }}
      </h3>
    </el-menu-item>
    <el-menu-item index="/">{{ $t("app.login") }}</el-menu-item>
    <el-menu-item index="UI">{{ $t("app.ui") }}</el-menu-item>
    <el-menu-item index="Options">{{ $t("app.options") }}</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useLoginStore } from "./store/loginStore";

const loginStore = useLoginStore();
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
./storage/loginStore
