<template>
  <el-container class="appContainer">
    <el-header id="header">
      <el-menu
        class="menu"
        mode="horizontal"
        :default-active="$route.fullPath"
        router
      >
        <el-sub-menu index="/" v-if="loginStore.userVo" class="menu-item">
        <el-sub-menu index="/" v-if="loginStore.userVo" class="menu-item">
          <template #title>
            <el-avatar
              class="avatar"
              :src="loginStore.avatar ? loginStore.avatar : 'avatar.png'"
              v-if="loginStore.userVo"
            />
            <span class="menu-item">
              {{
                loginStore.userVo
                  ? loginStore.userVo?.username
                  : $t("app.loggedOut")
              }}
            </span>
            <span class="menu-item">
              {{
                loginStore.userVo
                  ? loginStore.userVo?.username
                  : $t("app.loggedOut")
              }}
            </span>
          </template>
          <el-menu-item index="/user-info" class="sub-menu-item">
          <el-menu-item index="/user-info" class="sub-menu-item">
            {{ $t("app.userInfo") }}
          </el-menu-item>
          <el-menu-item index="/Chart">
            {{ $t("app.Chart") }}
          </el-menu-item>
          <el-menu-item @click="logout" class="sub-menu-item">
            {{ $t("app.logout") }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/" v-if="!loginStore.userVo" class="menu-item">
        <el-menu-item index="/" v-if="!loginStore.userVo" class="menu-item">
          {{ $t("app.login") }}
        </el-menu-item>
        <el-menu-item index="/dicts" class="menu-item">{{
          $t("app.dict")
        }}</el-menu-item>
        <el-menu-item index="/dicts" class="menu-item">{{
          $t("app.dict")
        }}</el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-if="taskStore.type == Task.Learn"
          class="menu-item"
          class="menu-item"
        >
          {{ $t("app.learn") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.Review"
          class="menu-item"
          class="menu-item"
        >
          {{ $t("app.review") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.QwertyMode"
          class="menu-item"
          class="menu-item"
        >
          {{ $t("app.qwertyMode") }}
        </el-menu-item>
        <el-menu-item index="/options" class="menu-item">{{
          $t("app.options")
        }}</el-menu-item>
        <el-menu-item index="/options" class="menu-item">{{
          $t("app.options")
        }}</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="appMain">
      <router-view v-slot="{ Component }">
        <transition name="globalAnimation" appear mode="out-in">
          <keep-alive :exclude="excludeCache">
            <component :is="Component" :key="$route.name" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { i18n } from "./main";
import { useI18n } from "vue-i18n";
import { useLoginStore } from "./store/loginStore";
import { useOptionsStore } from "./store/optionsStore";
import { Task, useTaskStore } from "./store/taskStore";
import { excludeCache } from "./components/Dicts/common";
import router from "./router";

const { t } = useI18n();
const loginStore = useLoginStore();
const taskStore = useTaskStore();

function logout(): void {
  ElMessageBox.confirm(t("app.logoutPrompt"), t("app.prompt"), {
    confirmButtonText: t("app.confirm"),
    cancelButtonText: t("app.cancel"),
  })
    .then((data) => {
      if (data == "confirm") {
        loginStore.userVo = null;
        loginStore.password = "";
        loginStore.avatar = "";
        localStorage.removeItem("satoken");
        router.push("/");
      }
    })
    .catch(() => {
      return;
    });
}

const optionsStore = useOptionsStore();
watch(
  () => optionsStore.lang,
  (value) => {
    i18n.global.locale.value = value;
  },
  { immediate: true },
);
</script>

<style scoped>
#header {
  width: 100%;
  margin: 0;
  padding: 0;
  height: 6vh;
  height: 6vh;
}
.menu {
  font-size: 12vw;
  font-size: 12vw;
  width: 100%;
  height: 6vh;
  height: 6vh;
  /* background-color: #ecf5ff; */
  z-index: 999;
  box-shadow: 0px 1px 15px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.menu-item {
  font-size: 1.8vh;
}

.sub-menu-item {
  height: 2vh;
  font-size: 1.8vh;
  margin: auto auto;
}

.menu-item {
  font-size: 1.8vh;
}

.sub-menu-item {
  height: 2vh;
  font-size: 1.8vh;
  margin: auto auto;
}

.avatar {
  height: 4.5vh;
  width: 4.5vh;
  margin-right: 1em;
}

.appContainer {
  padding: 0;
  height: 100%;
}

.globalAnimation-enter-from,
.globalAnimation-leave-to {
  opacity: 0;
}

.globalAnimation-move,
.globalAnimation-leave-active,
.globalAnimation-enter-active {
  transition: all 0.15s ease;
  /* transition-delay: 0.2s; */
}

.appMain {
  padding: 0;
}
</style>
