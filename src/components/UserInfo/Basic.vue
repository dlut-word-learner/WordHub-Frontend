<template>
  <div>
    <el-form label-position="left" label-width="50%" size="large">
      <el-form-item :label="$t('userInfo.basic.id')">
        <div>{{ userStore.userVo?.id }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.username')">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.role')">
        <div>
          {{ userStore.userVo ? userRole[userStore.userVo.role] : "" }}
        </div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.email')">
        <el-input type="email" v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.score')">
        <div>{{ userStore.userVo?.score }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveUserInfo">
          {{ $t("userInfo.basic.save") }}
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

const userStore = useUserStore();
const { t } = useI18n();
const userRole = [t("userInfo.basic.normalUser"), t("userInfo.basic.admin")];

const form = reactive({
  username: "",
  email: "",
});

axios
  .get(`/api/users/${userStore.userVo?.id}/profile`)
  .then((response) => {
    userStore.userVo = response.data;
  })
  .catch((error) => {
    throwError(error, "userInfo.basic.errGetInfo", t);
  });

if (userStore.userVo) {
  form.username = userStore.userVo.username;
  form.email = userStore.userVo.email;
}

function saveUserInfo(): void {
  if (form.username == "" || form.email == "") {
    ElMessage.info(t("userInfo.basic.inputPrompt"));
    return;
  }
  axios
    .put(`/api/users/${userStore.userVo?.id}/profile`, form, {
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      ElMessage.success(t("userInfo.basic.successPrompt"));
      logout();
    })
    .catch((error) => {
      throwError(error, "userInfo.basic.errPrompt", t);
    });
}
</script>

<style scoped></style>
