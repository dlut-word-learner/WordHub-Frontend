<template>
  <div id="body">
    <el-card class="dictCard" v-for="dict in dicts">
      <template #header>
        <div class="header">
          <div>{{ dict.dictName }}</div>
          <div>{{ dict.lang }}</div>
        </div>
      </template>
      <el-button class="button">{{ $t("dict.startLearn") }}</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { DictVo } from "./common";
import { useI18n } from "vue-i18n";
import axios from "axios";

const dicts: Ref<DictVo[] | null> = ref(null);
const { t } = useI18n();

axios
  .get("/dicts", {
    params: {
      lang: "English",
    },
  })
  .then((response) => {
    dicts.value = response.data;
  })
  .catch((error) => {
    console.log(error);
    ElMessage.error(t("dict.errGetDicts"));
  });
</script>

<style scoped>
#body {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dictCard {
  width: 480px;
}
</style>
