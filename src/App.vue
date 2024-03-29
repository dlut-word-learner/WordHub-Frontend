<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <el-container class="appContainer">
    <el-header id="header">
      <el-menu
        class="menu"
        mode="horizontal"
        :default-active="$route.fullPath"
        router
      >
        <el-sub-menu index="/" v-if="userStore.userVo" class="menu-item">
          <template #title>
            <el-avatar
              class="avatar"
              :src="userStore.avatar ? userStore.avatar : 'avatar.png'"
              v-if="userStore.userVo"
            />
            <span class="menu-item">
              {{
                userStore.userVo
                  ? userStore.userVo?.username
                  : $t("app.loggedOut")
              }}
            </span>
          </template>
          <el-menu-item index="/user-info">
            <div class="sub-menu-item">
              {{ $t("app.userInfo") }}
            </div>
          </el-menu-item>
          <el-menu-item index="/Chart">
            <div class="sub-menu-item">
              {{ $t("app.statistics") }}
            </div>
          </el-menu-item>
          <el-menu-item @click="logout">
            <div class="sub-menu-item">
              {{ $t("app.logout") }}
            </div>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/login" v-if="!userStore.userVo" class="menu-item">
          {{ $t("app.login") }}
        </el-menu-item>
        <el-menu-item index="/dicts" class="menu-item">{{
          $t("app.dict")
        }}</el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-if="taskStore.type == Task.Learn"
          class="menu-item"
        >
          {{ $t("app.learn") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.Review"
          class="menu-item"
        >
          {{ $t("app.review") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.QwertyMode"
          class="menu-item"
        >
          {{ $t("app.qwertyMode") }}
        </el-menu-item>
        <el-menu-item index="/options" class="menu-item">{{
          $t("app.options")
        }}</el-menu-item>
        <el-menu-item index="/about-us" class="menu-item" id="aboutUs">
          {{ $t("app.aboutUs") }}
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="appMain">
      <router-view v-slot="{ Component }">
        <transition name="globalAnimation" appear mode="out-in">
          <keep-alive
            :include="['QwertyMode', 'Learn', 'Review']"
            :exclude="excludeCache"
          >
            <component :is="Component" :key="$route.name" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "./store/userStore";
import { useOptionsStore } from "./store/optionsStore";
import { Task, useTaskStore } from "./store/taskStore";
import { excludeCache } from "./components/Dicts/common";
import router from "./router";
import { i18n } from "./locales";
import { onMounted } from "vue";
import axios from "axios";
import Cookies from 'js-cookie'

const { t } = useI18n();
const userStore = useUserStore();
const taskStore = useTaskStore();

function logout(): void {
  ElMessageBox.confirm(t("app.logoutPrompt"), t("app.prompt"), {
    confirmButtonText: t("app.confirm"),
    cancelButtonText: t("app.cancel"),
    buttonSize: "large",
  })
    .then((data) => {
      if (data == "confirm") {
        userStore.logout();
        Cookies.remove("satoken");
        excludeCache.value = Task[taskStore.type];
        taskStore.type = Task.None;
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

onMounted(()=>{
  if(userStore.userVo){
    axios
    .get(`/api/users/${userStore.userVo.id}/profile/avatar`, {
      responseType: "blob",
    })
    .then((response) => {
      userStore.avatar = window.URL.createObjectURL(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
})
</script>

<style scoped>
#header {
  width: 100%;
  padding: 0;
  height: max(6vh, 3vw);
}
.menu {
  font-size: max(6vh, 3vw);
  width: 100%;
  height: max(6vh, 3vw);
  background-color: white;
  z-index: 999;
  box-shadow: 0px 1px 15px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

html.dark .menu {
  background-color: #242424;
}

.menu-item {
  text-align: center;
  font-size: max(1.8vh, 0.9vw);
}

.sub-menu-item {
  text-align: center;
  width: 100%;
  font-size: max(1.8vh, 0.9vw);
}

.avatar {
  height: max(2.5vw, 1.8vh);
  width: max(2.5vw, 1.8vh);
  margin-right: 14px;
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

#aboutUs {
  position: absolute;
  right: 20px;
  font-size: max(1.5vh, 0.5vw);
}
</style>
