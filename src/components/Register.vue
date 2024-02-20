<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div id="body">
    <img alt="WordHub" src="/wordhub.png" width="100" height="100" />
    <h2>{{ $t("register.userRegister") }}</h2>
    <el-form label-width="auto" size="large">
      <el-form-item :label="$t('register.username')">
        <el-input type="text" v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('register.passwd1')">
        <el-tooltip placement="top">
          <template #content>
            {{ $t("register.passwdTip1") }}<br />
            {{ $t("register.passwdTip2") }}<br />
          </template>
          <el-input
            type="password"
            v-model="form.passwd1"
            :show-password="true"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('register.passwd2')">
        <el-input
          type="password"
          v-model="form.passwd2"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item :label="$t('register.email')">
        <el-input type="email" v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('register.avatar')">
        <el-checkbox
          v-model="isAvatarDef"
          :label="$t('register.defAvatar')"
        ></el-checkbox>
      </el-form-item>
      <label id="uploadBtn" for="uploads" v-if="!isAvatarDef">
        {{ $t("register.clickUploadAvatar") }}
      </label>
      <input
        type="file"
        id="uploads"
        style="position: absolute; clip: rect(0 0 0 0)"
        accept="image/bmp, image/png, image/jpeg, image/jpg, image/gif"
        @change="uploadImg($event)"
      />
      <div id="cropper" v-if="!isAvatarDef">
        <vueCropper ref="cropper" v-bind="option"></vueCropper>
      </div>
    </el-form>
    <el-button @click="register" size="large">
      {{ $t("register.register") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { VueCropper } from "vue-cropper";
import router from "../router";
import sha3 from "crypto-js/sha3";
import axios from "axios";
import "vue-cropper/dist/index.css";
import { throwError } from "./Error";

const form = reactive({
  username: "",
  passwd1: "",
  passwd2: "",
  email: "",
  avatar: new Blob(),
});

const { t } = useI18n();

const cropper = ref(null as VueCropper);
const isAvatarDef = ref(true);

const option = reactive({
  img: "",
  size: 0,
  outputType: "png",
  fixedBox: false,
  autoCrop: true,
  autoCropWidth: 200,
  autoCropHeight: 200,
  high: false,
  cropData: {},
  limitMinSize: [50, 50],
  fixed: true,
  fixedNumber: [1, 1],
});

function register(): void {
  if (
    form.username == "" ||
    form.passwd1 == "" ||
    form.passwd2 == "" ||
    form.email == ""
  ) {
    ElMessage.info(t("register.inputPrompt"));
    return;
  }

  if (!checkPasswd(form.passwd1) || !checkEmail(form.email)) return;

  if (form.passwd1 != form.passwd2) {
    ElMessage.error(t("register.diffPrompt"));
    return;
  }

  const formData = new FormData();
  formData.append("username", form.username);
  formData.append("password", sha3(form.passwd1).toString());
  formData.append("email", form.email);

  cropper.value.getCropBlob((data: Blob) => {
    form.avatar = data;
  });
  setTimeout(() => {
    if (!form.avatar.size) {
      console.log("avater is null!");
      return;
    }
    formData.append("avatar", form.avatar);
    // 给个延迟就行了，笑死
    axios
      .post("/api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        ElMessage.success(t("register.successPrompt"));
        router.push("/login");
      })
      .catch((error) => {
        throwError(error, "register.errPrompt", t);
      });
  }, 300);
}

function checkPasswd(password: string): boolean {
  if (
    password.length >= 8 &&
    password.length <= 20 &&
    password.match(/[a-zA-Z]/g) &&
    password.match(/[0-9]/g)
  )
    return true;

  ElMessage.error(t("register.invalidPwd"));
  return false;
}

function checkEmail(email: string): boolean {
  if (
    email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  )
    return true;

  ElMessage.error(t("register.invalidEmail"));
  return false;
}

function uploadImg(event: any): void {
  const file = event.target.files[0];
  if (
    !/\.(bmp|gif|jpg|jpeg|png|BMP|GIF|JPG|JPEG|PNG)$/.test(event.target.value)
  )
    ElMessage.error(t("register.avatarTypeErr"));

  const reader = new FileReader();
  reader.onload = (event) => {
    let data: string;
    if (typeof event.target?.result === "object" && event.target?.result) {
      data = window.URL.createObjectURL(new Blob([event.target?.result]));
      option.img = data;
    }
  };

  reader.readAsArrayBuffer(file);
  ElMessage.success(t("register.avatarUploadSuccess"));
}
</script>

<style scoped>
#body {
  width: 400px;
  margin: 100px auto;
}

#cropper {
  width: 300px;
  height: 300px;
  margin: auto auto;
  margin-bottom: 1em;
}

#uploadBtn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;

  margin-bottom: 30px;
  padding: 12px 18px;

  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}
</style>
