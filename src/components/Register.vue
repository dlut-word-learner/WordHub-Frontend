<template>
  <div id="body">
    <img src="/wordhub.png" width="100" height="100" />
    <h2>{{ $t("register.userRegister") }}</h2>
    <el-form label-width="80px">
      <el-form-item :label="$t('register.username')">
        <el-input type="text" v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('register.password')">
        <el-tooltip placement="top">
          <template #content>
            {{ $t("register.passwdTip1") }}<br />
            {{ $t("register.passwdTip2") }}<br />
          </template>
          <el-input
            type="password"
            v-model="form.password"
            :show-password="true"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('register.email')">
        <el-input type="email" v-model="form.email" />
      </el-form-item>
    </el-form>
    <el-button @click="register">{{ $t("register.register") }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import router from "../router";
import sha3 from "crypto-js/sha3";
import axios from "axios";

const form = reactive({
  username: "",
  password: "",
  email: "",
});

const { t } = useI18n();

function register() {
  if (form.username == "" || form.password == "" || form.email == "") {
    ElMessage.info(t("register.inputPrompt"));
    return;
  }

  if (!checkPasswd()) return;

  const hash = sha3(form.password).toString();

  axios
    .post(
      "/api/users",
      { username: form.username, password: hash, email: form.email },
      { headers: { "Content-Type": "multipart/form-data" } },
    )
    .then(() => {
      ElMessage.success(t("register.successPrompt"));
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("register.errPrompt"));
    });
}

function checkPasswd(): boolean {
  if (
    form.password.length >= 8 &&
    form.password.length <= 20 &&
    form.password.match(/[a-zA-Z]/g) &&
    form.password.match(/[0-9]/g)
  )
    return true;

  ElMessage.error(t("register.invalidPwd"));
  return false;
}
</script>

<style scoped>
#body {
  width: 400px;
  margin: 100px auto;
}
</style>
