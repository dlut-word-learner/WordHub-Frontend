<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <el-form label-position="left" label-width="50%" size="large">
      <el-form-item :label="$t('userInfo.delete.username')">
        <div>{{ userStore.userVo?.username }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.delete.passwd1')">
        <el-input
          type="password"
          v-model="form.passwd1"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item :label="$t('userInfo.delete.passwd2')">
        <el-input
          type="password"
          v-model="form.passwd2"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deleteUser">
          {{ $t("userInfo.delete.delete") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useUserStore } from "../../store/userStore";
import { useI18n } from "vue-i18n";
import { throwError } from "../Error";
import { logout } from "./common";
import axios from "axios";
import sha3 from "crypto-js/sha3";

const form = reactive({
  passwd1: "",
  passwd2: "",
});

const userStore = useUserStore();
const { t } = useI18n();

function deleteUser(): void {
  if (form.passwd1 == "" || form.passwd2 == "") {
    ElMessage.info(t("userInfo.delete.inputPrompt"));
    return;
  }

  if (form.passwd1 != form.passwd2) {
    ElMessage.error(t("userInfo.delete.diffPrompt"));
    return;
  }

  const hash = sha3(form.passwd1).toString();
  if (hash != userStore.password) {
    ElMessage.error(t("userInfo.delete.wrongPwdPrompt"));
    return;
  }

  ElMessageBox.confirm(
    t("userInfo.delete.deletePrompt"),
    t("userInfo.delete.prompt"),
    {
      confirmButtonText: t("userInfo.delete.confirm"),
      cancelButtonText: t("userInfo.delete.cancel"),
      buttonSize: "large",
    },
  )
    .then(() => {
      axios
        .delete(`/api/users/${userStore.userVo?.id}`)
        .then(() => {
          ElMessage.success(t("userInfo.delete.successPrompt"));
          logout();
        })
        .catch((error) => {
          throwError(error, "userInfo.delete.errPrompt", t);
        });
    })
    .catch(() => {
      return;
    });
}
</script>

<style scoped></style>
