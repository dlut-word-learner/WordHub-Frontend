<template>
  <div id="userInfo">
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('userinfo.id')">
        <div>{{ loginStore.userVo.id }}</div>
      </el-form-item>
      <el-form-item :label="$t('userinfo.username')">
        <el-input v-model="loginStore.userVo.username" />
      </el-form-item>
      <el-form-item :label="$t('userinfo.role')">
        <div>{{ userRole[loginStore.userVo.role] }}</div>
      </el-form-item>
      <el-form-item :label="$t('userinfo.email')">
        <el-input type="email" v-model="loginStore.userVo.email" />
      </el-form-item>
      <el-form-item :label="$t('userinfo.score')">
        <div>{{ loginStore.userVo.score }}</div>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveUserInfo">
      {{ $t("userinfo.save") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useLoginStore } from "../store/loginStore";
import { useI18n } from "vue-i18n";

const loginStore = useLoginStore();
const { t } = useI18n();

const userRole = [t("userinfo.normalUser"), t("userinfo.admin")];

function saveUserInfo() {
  // Save user information
}
</script>

<style scoped>
#userInfo {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}
</style>
