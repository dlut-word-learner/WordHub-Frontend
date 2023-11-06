<template>
  <router-view></router-view>
  <div class="a">
    <div class="b"></div>
    <div class="c"></div>
    <div class="d"></div>
    <div class="e"></div>

    <div id="body" type="flex">
      <img src="/wordhub.png" width="100" height="100" />
      <h2 class="f">{{ $t("login.userLogin") }}</h2>
      <el-form label-width="auto">
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
      <el-button type="primary" @click="login">{{
        $t("login.login")
      }}</el-button>
      <el-button @click="router.push('/register')">
        {{ $t("login.register") }}
      </el-button>
    </div>
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

function login(): void {
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
      router.push("/dicts");
    })
    .catch((error) => {
      if (error.response) ElMessage.error(t("login.userErrPrompt"));
      else ElMessage.error(t("login.networkErrPrompt"));
    });
}

function getAvatar(): void {
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
.a {
  position: relative;
  top: 100px;
  width: 1000px;
  height: 600px;
  border: 10px solid white;
  background-image: url("163727-15190294471b41.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.b,
.c,
.d,
.e {
  position: absolute;
  width: 500px;
  height: 600px;
  background-image: url("163727-15190294471b41.jpg");
  background-color: #409eff;
  filter: drop-shadow(4px 4px 12px rgb(0, 0, 0));
  background-size: cover;
  opacity: 0.6;
  transition: 1.5s;
}

.b {
  left: 0;
  clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 65% 0%);
  background-position: -100px 0;
}

.c {
  left: 0;
  clip-path: polygon(0% 0%, 0% 100%, 70% 100%, 90% 0%);
  background-position: -100px 0;
}

.d {
  right: 0;
  clip-path: polygon(0% 0%, 40% 100%, 100% 100%, 100% 0%);
  background-position: 800px 0;
}

.e {
  right: 0;
  clip-path: polygon(20% 0%, 0% 100%, 100% 100%, 100% 0%);
  background-position: 800px 0;
}

.a:hover .b {
  left: -200px;
}

.a:hover .c {
  left: -150px;
}

.a:hover .d {
  right: -140px;
}

.a:hover .e {
  right: -220px;
}

.a:hover div {
  opacity: 1;
}

.f {
  opacity: 0;
  font: 900 50px "";
  letter-spacing: 10px;
  color: #909399;
  transition: 1.5s;
}

.a:hover .f {
  opacity: 1;
}
</style>
