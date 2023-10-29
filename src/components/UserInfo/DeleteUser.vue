<template>
  <div id="body">
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('userInfo.delete.username')">
        <div>{{ loginStore.userVo.username }}</div>
      </el-form-item>
      <el-form-item :label="$t('userInfo.delete.pwd1')">
        <el-input type="password" v-model="form.pwd1" :show-password="true" />
      </el-form-item>
      <el-form-item :label="$t('userInfo.delete.pwd2')">
        <el-input type="password" v-model="form.pwd2" :show-password="true" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="prepareDeleteUser">
      {{ $t("userInfo.delete.delete") }}
    </el-button>
    <el-dialog
      v-model="confirmVisible"
      :title="$t('userInfo.delete.prompt')"
      width="30%"
    >
      <span>{{ $t("userInfo.delete.deletePrompt") }}</span>
      <template #footer>
        <span>
          <el-button @click="confirmVisible = false">
            {{ $t("userInfo.delete.cancel") }}
          </el-button>
          <el-button type="primary" @click="deleteUser">
            {{ $t("userInfo.delete.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useLoginStore } from "../../store/loginStore";
import { useI18n } from "vue-i18n";
import axios from "axios";
import sha3 from "crypto-js/sha3";
import router from "../../router";

const form = reactive({
  pwd1: "",
  pwd2: "",
});

const confirmVisible = ref(false);
const loginStore = useLoginStore();
const { t } = useI18n();

function prepareDeleteUser() {
  if (form.pwd1 == "" || form.pwd2 == "") {
    ElMessage.info(t("userInfo.delete.inputPrompt"));
    return;
  }

  if (form.pwd1 != form.pwd2) {
    ElMessage.error(t("userInfo.delete.diffPrompt"));
    return;
  }

  const hash = sha3(form.pwd1).toString();
  if (hash != loginStore.password) {
    ElMessage.error(t("userInfo.delete.wrongPwdPrompt"));
    return;
  }

  confirmVisible.value = true;
}

function deleteUser() {
  confirmVisible.value = false;

  axios
    .delete("/api/users/")
    .then(() => {
      ElMessage.success(t("userInfo.delete.successPrompt"));
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("userInfo.delete.errPrompt"));
    });
}
</script>

<style scoped>
#body {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}
</style>
