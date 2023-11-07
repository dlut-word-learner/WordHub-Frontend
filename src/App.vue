<template>
  <el-container class="appContainer">
    <el-header>
      <el-menu
        class="menu"
        mode="horizontal"
        :default-active="$route.fullPath"
        router
      >
        <el-sub-menu index="/" v-if="loginStore.userVo">
          <template #title>
            <el-avatar
              class="avatar"
              :src="loginStore.avatar ? loginStore.avatar : 'avatar.png'"
              v-if="loginStore.userVo"
            />
            {{
              loginStore.userVo
                ? loginStore.userVo?.username
                : $t("app.loggedOut")
            }}
          </template>
          <el-menu-item index="/user-info">
            {{ $t("app.userInfo") }}
          </el-menu-item>
          <el-menu-item @click="logout">
            {{ $t("app.logout") }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/" v-if="!loginStore.userVo">
          {{ $t("app.login") }}
        </el-menu-item>
        <el-menu-item index="/dicts">{{ $t("app.dict") }}</el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-if="taskStore.type == Task.Learn"
        >
          {{ $t("app.learn") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.Review"
        >
          {{ $t("app.review") }}
        </el-menu-item>
        <el-menu-item
          :index="taskStore.url"
          v-else-if="taskStore.type == Task.QwertyMode"
        >
          {{ $t("app.qwertyMode") }}
        </el-menu-item>
        <el-menu-item index="/options">{{ $t("app.options") }}</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="appMain">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="excludeCache">
          <component :is="Component" />
        </keep-alive>
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
.menu {
  min-width: 640px;
}

.avatar {
  margin-right: 1em;
}

.appContainer {
  padding: 0;
  height: 100%;
}

.appMain {
  padding: 0;
}
</style>
