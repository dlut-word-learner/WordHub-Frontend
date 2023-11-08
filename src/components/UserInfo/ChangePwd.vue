<template>
  <div>
    <el-form label-position="left" label-width="50%">
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
import { useLoginStore } from "../../store/loginStore";
import sha3 from "crypto-js/sha3";
import axios from "axios";
import router from "../../router";

const form = reactive({
  originalPwd: "",
  newPasswd1: "",
  newPasswd2: "",
});

const loginStore = useLoginStore();

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

  if (passwdHash.original != loginStore.password) {
    ElMessage.error(t("userInfo.pwd.originalPwdPrompt"));
    return;
  }

  axios
    .post(`/api/users/${loginStore.userVo?.id}/password`, passwdHash.new, {
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      ElMessage.success(t("userinfo.changePwd.successPrompt"));
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("userinfo.changePwd.errorPrompt"));
    });
}
</script>

<style scoped></style>
