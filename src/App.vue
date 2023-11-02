<template>
  <el-menu class="menu" mode="horizontal" default-active="/" :router="true">
    <el-sub-menu index="/" v-if="loginStore.userVo">
      <template #title>
        <el-avatar
          class="avatar"
          :src="loginStore.avatar"
          v-if="loginStore.userVo"
        />
        {{
          loginStore.userVo ? loginStore.userVo?.username : $t("app.loggedOut")
        }}
      </template>
      <el-menu-item index="/user-info">{{ $t("app.userInfo") }}</el-menu-item>
      <el-menu-item @click="confirmVisible = true">
        {{ $t("app.logout") }}
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/" v-if="!loginStore.userVo">
      {{ $t("app.login") }}
    </el-menu-item>
    <el-menu-item index="/dicts">{{ $t("app.dict") }}</el-menu-item>
    <el-menu-item index="/learn">{{ $t("app.learn") }}</el-menu-item>
    <el-menu-item index="/options">{{ $t("app.options") }}</el-menu-item>
  </el-menu>
  <el-dialog v-model="confirmVisible" :title="$t('app.prompt')" width="30%">
    <span>{{ $t("app.logoutPrompt") }}</span>
    <template #footer>
      <span>
        <el-button @click="confirmVisible = false">
          {{ $t("app.cancel") }}
        </el-button>
        <el-button type="primary" @click="logout">
          {{ $t("app.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLoginStore } from "./store/loginStore";
import { useOptionsStore } from "./store/optionsStore";
import { i18n } from "./main";
import router from "./router";

const loginStore = useLoginStore();
const confirmVisible = ref(false);

function logout(): void {
  confirmVisible.value = false;
  loginStore.userVo = null;
  loginStore.password = "";
  loginStore.avatar = "";
  localStorage.removeItem("satoken");
  router.push("/");
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
</style>
