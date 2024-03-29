<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <el-form label-position="left" label-width="50%" size="large">
      <el-form-item :label="$t('userInfo.pwd.originalPwd')">
        <el-input
          type="password"
          v-model="form.originalPwd"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item :label="$t('userInfo.pwd.newPasswd1')">
        <el-input
          type="password"
          v-model="form.newPasswd1"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item :label="$t('userInfo.pwd.newPasswd2')">
        <el-input
          type="password"
          v-model="form.newPasswd2"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePasswd">
          {{ $t("userInfo.pwd.save") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../store/userStore";
import { throwError } from "../Error";
import { logout } from "./common";
import sha3 from "crypto-js/sha3";
import axios from "axios";

const form = reactive({
  originalPwd: "",
  newPasswd1: "",
  newPasswd2: "",
});

const userStore = useUserStore();

const { t } = useI18n();

function savePasswd(): void {
  if (
    form.originalPwd == "" ||
    form.newPasswd1 == "" ||
    form.newPasswd2 == ""
  ) {
    ElMessage.info(t("userInfo.pwd.inputPrompt"));
    return;
  }

  if (form.originalPwd == form.newPasswd1) {
    ElMessage.error(t("userInfo.pwd.samePrompt"));
    return;
  }

  if (form.newPasswd1 != form.newPasswd2) {
    ElMessage.error(t("userInfo.pwd.diffPrompt"));
    return;
  }

  const passwdHash = reactive({
    original: sha3(form.originalPwd).toString(),
    new: sha3(form.newPasswd1).toString(),
  });

  if (passwdHash.original != userStore.password) {
    ElMessage.error(t("userInfo.pwd.originalPwdPrompt"));
    return;
  }

  axios
    .put(
      `/api/users/${userStore.userVo?.id}/profile/password`,
      passwdHash.new,
      {
        headers: { "Content-Type": "text/plain" },
      },
    )
    .then(() => {
      ElMessage.success(t("userInfo.changePwd.successPrompt"));
      logout();
    })
    .catch((error) => {
      throwError(error, "userInfo.changePwd.errorPrompt", t);
    });
}
</script>

<style scoped></style>
