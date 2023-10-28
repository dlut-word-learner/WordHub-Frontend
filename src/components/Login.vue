<template>
  <router-view></router-view>
  <div id="body">
    <img src="/wordhub.png" width="100" height="100" />
    <h2>{{ $t("login.userLogin") }}</h2>
    <el-form label-width="80px">
      <el-form-item :label="$t('login.username')">
        <el-input type="text" id="username" v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('login.password')">
        <el-input
          type="password"
          id="password"
          v-model="form.password"
          :show-password="true"
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">{{ $t("login.login") }}</el-button>
    <el-button @click="router.push('/register')">
      {{ $t("login.register") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserVo, useLoginStore } from "../store/loginStore";
import { useI18n } from "vue-i18n";
// import { axiosInstance } from "../main";
import router from "../router/index";
import axios from "axios";

const { t } = useI18n();

const form = reactive({
  username: "",
  password: "",
});

const loginStore = useLoginStore();

async function login() {
  if (form.username == "" || form.password == "") {
    ElMessage.info(t("login.inputPrompt"));
    return;
  }

  // const { scryptSync, randomBytes } = await import("crypto");
  // const salt = randomBytes(32).toString("hex");
  // const hash = await scryptSync(form.password, salt, 64).toString("hex");

  axios
    .post(
      "/api/session",
      { username: form.username, password: form.password },
      { headers: { "Content-Type": "text/json; charset=UTF-8" } },
    )
    .then((response) => {
      ElMessage.success(t("login.successPrompt"));
      const userVo: UserVo = JSON.parse(response.data);
      loginStore.userVo = userVo;
      loginStore.online = true;
    })
    .catch((error) => {
      if (error.response) ElMessage.error(t("login.userErrPrompt"));
      else ElMessage.error(t("login.networkErrPrompt"));
    });
}
</script>

<style scoped>
#body {
  width: 400px;
  margin: 200px auto;
}
</style>
