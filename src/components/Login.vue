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
import router from "../router";
import sha3 from "crypto-js/sha3";
import axios from "axios";

const { t } = useI18n();

const form = reactive({
  username: "",
  password: "",
});

const loginStore = useLoginStore();

function login() {
  if (form.username == "" || form.password == "") {
    ElMessage.info(t("login.inputPrompt"));
    return;
  }

  const hash = sha3(form.password).toString();

  axios
    .post(
      "/api/session",
      { username: form.username, password: hash },
      { headers: { "Content-Type": "application/json; charset=UTF-8" } },
    )
    .then((response) => {
      ElMessage.success(t("login.successPrompt"));
      const userVo: UserVo = response.data;
      loginStore.userVo = userVo;
      loginStore.password = form.password;
      getAvatar();
      router.push("/user-info");
    })
    .catch((error) => {
      if (error.response) ElMessage.error(t("login.userErrPrompt"));
      else ElMessage.error(t("login.networkErrPrompt"));
    });
}

function getAvatar() {
  axios
    .get(`/api/users/${loginStore.userVo?.id}/profile/avatar`, {
      responseType: "blob",
    })
    .then((response) => {
      loginStore.avatar = window.URL.createObjectURL(response.data);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("userInfo.avatar.errGetAvatar"));
    });
}
</script>

<style scoped>
#body {
  width: 400px;
  margin: 200px auto;
}
</style>
