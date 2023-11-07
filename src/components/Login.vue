<template>
  <router-view></router-view>
  <div class="a">
    <div class="b"></div>
    <div class="c"></div>
    <div class="d"></div>
    <div class="e"></div>

    <el-container id="body">
      <el-header>
        <img src="/wordhub.png" width="100" height="100" class="logo" />
      </el-header>
      <el-main>
        <h2 class="f">{{ $t("login.userLogin") }}</h2>
      </el-main>
      <el-main>
        <el-form label-width="auto">
          <el-form-item :label="$t('login.username')" size="large">
            <el-input
              type="text"
              id="username"
              v-model="form.username"
              size="large"
            />
          </el-form-item>
          <el-form-item :label="$t('login.password')" size="large">
            <el-input
              type="password"
              id="password"
              v-model="form.password"
              :show-password="true"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-main>
      <el-main>
        <el-button type="primary" @click="login" size="large">{{
          $t("login.login")
        }}</el-button>
        <el-button @click="router.push('/register')" size="large">
          {{ $t("login.register") }}
        </el-button>
      </el-main>
    </el-container>
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
  margin: 400px 100px;
  padding: 25%;
}

.a {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 700px;
  margin: auto auto;
  /* border: 10px solid white; */
  /* background-image: url("163727-15190294471b41.jpg"); */
  background-size: cover;
  display: inline-block;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 997;
}

.b,
.c,
.d,
.e {
  position: absolute;
  width: 45%;
  height: 700px;
  background-image: linear-gradient(
    180deg,
    rgb(207, 252, 231),
    rgb(206, 229, 253)
  );
  filter: drop-shadow(4px 4px 12px rgb(0, 0, 0));
  background-size: cover;
  opacity: 0.6;
  transition: all 1.5s ease;
  z-index: 997;
}

html.dark .b,
html.dark .c,
html.dark .d,
html.dark .e {
  background-image: linear-gradient(180deg, rgb(92, 44, 169), rgb(60, 44, 79));
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
  opacity: 0.9;
}

.f {
  opacity: 0;
  font: 900 50px "";
  letter-spacing: 10px;
  color: #73767a;
  transition: 1.5s;
}

.a:hover .f {
  opacity: 1;
}
</style>
