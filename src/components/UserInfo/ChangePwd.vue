<template>
  <el-form-item :label="$t('userInfo.basic.originalPwd')">
    <el-input
      type="password"
      v-model="form.originalPwd"
      :show-password="true"
    />
  </el-form-item>
  <el-form-item :label="$t('userInfo.basic.newPasswd')">
    <el-input type="password" v-model="form.newPasswd" :show-password="true" />
  </el-form-item>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  originalPwd: "",
  newPasswd: "",
});
</script>

<style scoped></style>
