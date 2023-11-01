<template>
  <div id="body">
    <el-card class="dictCard" v-for="dict in dicts">
      <template #header>
        <div class="header">
          <div>{{ dict.name }}</div>
          <div>{{ dict.language }}</div>
        </div>
      </template>
      <el-button @click="learn(dict.id)">{{ $t("dict.learn") }}</el-button>
      <el-button @click="review(dict.id)">
        {{ $t("dict.review") }}
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { DictVo } from "./common";
import { useI18n } from "vue-i18n";
import { DictAction, useDictStore } from "../../store/dictStore";
import axios from "axios";
import router from "../../router";

const dicts: Ref<DictVo[] | null> = ref(null);
const { t } = useI18n();
const dictStore = useDictStore();

axios
  .get("/api/dicts", {
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

function learn(dictId: number) {
  dictStore.action = DictAction.Learn;
  dictStore.dictId = dictId;
  dictStore.dictLang = "en";
  router.push("/ui");
}

function review(dictId: number) {
  dictStore.action = DictAction.Review;
  dictStore.dictId = dictId;
  dictStore.dictLang = "en";
  router.push("/ui");
}
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
