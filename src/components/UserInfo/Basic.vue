<template>
  <div id="userInfo">
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('userInfo.basic.id')">
        <div>{{ loginStore.userVo.id }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.username')">
        <el-input v-model="loginStore.userVo.username" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.role')">
        <div>{{ userRole[loginStore.userVo.role] }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.email')">
        <el-input type="email" v-model="loginStore.userVo.email" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.basic.score')">
        <div>{{ loginStore.userVo.score }}</div>
      </el-form-item>
   </el-form>
    <el-button type="primary" @click="saveUserInfo">
      {{ $t("userInfo.basic.save") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useLoginStore } from "../../store/loginStore";
import { useI18n } from "vue-i18n";

const loginStore = useLoginStore();
const { t } = useI18n();
const userRole = [t("userInfo.basic.normalUser"), t("userInfo.basic.admin")];

async function saveUserInfo() {
  /*
  const { scryptSync, randomBytes } = await import("crypto");
  const salt = randomBytes(32).toString("hex");
  const hash = await scryptSync(loginStore.userVo.password, salt, 64).toString("hex");

  await axiosInstance
    .post(
      "/user",
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
  */
}
</script>

<style scoped>
#userInfo {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}
</style>
