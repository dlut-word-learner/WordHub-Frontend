<template>
  <div>
    <el-form label-position="left" label-width="50%" size="large">
      <el-form-item :label="$t('userInfo.basic.id')">
        <div>{{ loginStore.userVo?.id }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.username')">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.role')">
        <div>
          {{ loginStore.userVo ? userRole[loginStore.userVo.role] : "" }}
        </div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.email')">
        <el-input type="email" v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.score')">
        <div>{{ loginStore.userVo?.score }}</div>
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
import { useLoginStore } from "../../store/loginStore";
import { useI18n } from "vue-i18n";
import { throwError } from "../Error";
import { logout } from "./common";
import axios from "axios";

const loginStore = useLoginStore();
const { t } = useI18n();
const userRole = [t("userInfo.basic.normalUser"), t("userInfo.basic.admin")];

const form = reactive({
  username: "",
  email: "",
});

axios
  .get(`/api/users/${loginStore.userVo?.id}/profile`)
  .then((response) => {
    loginStore.userVo = response.data;
  })
  .catch((error) => {
    throwError(error, "userInfo.basic.errGetInfo", t);
  });

if (loginStore.userVo) {
  form.username = loginStore.userVo.username;
  form.email = loginStore.userVo.email;
}

function saveUserInfo(): void {
  if (form.username == "" || form.email == "") {
    ElMessage.info(t("userInfo.basic.inputPrompt"));
    return;
  }
  axios
    .put(`/api/users/${loginStore.userVo?.id}/profile`, form, {
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
