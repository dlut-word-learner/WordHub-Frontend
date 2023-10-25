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
      <el-menu-item index="UserInfo">{{ $t("app.userinfo") }}</el-menu-item>
      <el-menu-item @click="confirmVisible = true">
        {{ $t("app.logout") }}
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/" v-if="!loginStore.online">
      {{ $t("app.login") }}
    </el-menu-item>
    <el-menu-item index="UI">{{ $t("app.ui") }}</el-menu-item>
    <el-menu-item index="Options">{{ $t("app.options") }}</el-menu-item>
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
import router from "./router/index";
import { useLoginStore } from "./store/loginStore";
import { useOptionsStore } from "./store/optionsStore";
import { i18n } from "./main";

const loginStore = useLoginStore();
const confirmVisible = ref(false);

function logout() {
  confirmVisible.value = false;
  loginStore.online = false;
  loginStore.username = "";
  loginStore.password = "";
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
  margin-bottom: 2em;
  min-width: 640px;
}

.avatar {
  margin-right: 1em;
}
</style>
