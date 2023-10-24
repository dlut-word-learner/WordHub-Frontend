<template>
  <div>
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('userinfo.username')">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('userinfo.email')">
        <el-input type="email" v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('userinfo.phone')">
        <el-input type="tel" v-model="form.phone" />
      </el-form-item>
      <el-form-item :label="$t('userinfo.gender')">
        <el-select
          v-model="form.gender"
          :placeholder="$t('userinfo.pleaseSelect')"
        >
          <el-option
            v-for="gender in genders"
            :key="gender.value"
            :label="gender.label"
            :value="gender.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userinfo.birthday')">
        <el-date-picker v-model="form.birthday" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveUserInfo">
      {{ $t("userinfo.save") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useLoginStore } from "../store/loginStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const loginStore = useLoginStore();

const form = reactive({
  username: loginStore.username,
  email: "",
  phone: "",
  gender: "",
  birthday: new Date(),
});

const genders = [
  {
    value: "male",
    label: t("userinfo.male"),
  },
  {
    value: "female",
    label: t("userinfo.female"),
  },
  {
    value: "nonbinary",
    label: t("userinfo.nonbinary"),
  },
  {
    value: "secret",
    label: t("userinfo.secret"),
  },
];

function saveUserInfo() {
  loginStore.username = form.username;

  // Save user information
}
</script>
<style scoped></style>
