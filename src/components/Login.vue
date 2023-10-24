<template>
  <router-view></router-view>
  <div id="loginPanel">
    <img src="/wordhub.png" width="100" height="100" />
    <h2>{{ $t("login.userLogin") }}</h2>
    <el-form label-width="80px">
      <el-form-item :label="$t('login.username')">
        <el-input type="text" id="username" v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('login.password')">
        <el-input type="text" id="password" v-model="form.password" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">{{ $t("login.login") }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useLoginStore } from "../store/loginStore";
import { useI18n } from "vue-i18n";
import router from "../router/index";

const { t } = useI18n();

const form = reactive({
  username: "",
  password: "",
});

const loginStore = useLoginStore();

function login() {
  if (form.username === "" || form.password === "")
    ElMessage.info(t("login.inputPrompt"));
  else if (form.username === "user" && form.password === "password") {
    loginStore.username = form.username;
    loginStore.password = form.password;
    loginStore.online = true;
    router.push("/UserInfo");
    ElMessage.success(t("login.successPrompt"));
  } else ElMessage.error(t("login.errorPrompt"));
}
</script>

<style scoped>
#loginPanel {
  width: 400px;
  margin: 200px auto;
}
</style>
