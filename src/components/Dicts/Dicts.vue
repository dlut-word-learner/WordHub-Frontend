<template>
  <el-row>
    <el-col :span="navSpan">
      <el-menu v-for="[_, abbr] in langs" @select="onSelectLang">
        <el-menu-item :index="abbr">
          <div class="navItem">{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="24 - navSpan">
      <div id="body">
        <el-card class="dictCard" v-for="dict in dicts" v-show="curLang=='all'||langs.get(dict.language)==curLang">
          <template #header>
            <div class="header">
              <div>{{ dict.name }}</div>
              <div>{{ dict.language }}</div>
            </div>
          </template>
          <el-button @click="learn(dict)">{{ $t("dict.learn") }}</el-button>
          <el-button @click="review(dict)">{{ $t("dict.review") }}</el-button>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { DictVo, langs } from "./common";
import { Ref, ref } from "vue";
import { i18n } from "../../main";
import { useI18n } from "vue-i18n";
import { DictAction, useDictStore } from "../../store/dictStore";
import axios from "axios";
import router from "../../router";
import { onMounted } from "vue";
const dicts: Ref<DictVo[]> = ref([]);
const { t } = useI18n();
const dictStore = useDictStore();
const navSpan = ref(0);
const curLang: Ref<string> = ref('all');

switch (i18n.global.locale.value) {
  case "zh_cn":
    navSpan.value = 2;
    break;

  case "en":
  case "ja":
    navSpan.value = 3;
    break;
}

function onSelectLang(index: string, _indexPath, _routeResult){
  curLang.value = index;
}

function learn(dict: DictVo) {
  dictStore.action = DictAction.Learn;
  dictStore.id = dict.id;
  if(langs.has(dict.language))
    dictStore.lang = langs.get(dict.language) as string;
  console.log("dict's language: " + langs.get(dict.language));
  router.push("/learn");
}

function review(dict: DictVo) {
  dictStore.action = DictAction.Review;
  dictStore.id = dict.id;
  dictStore.lang = langs[dict.language];
  router.push("/learn");
}

onMounted(()=>{
  axios
  .get("/api/dicts")
  .then((response) => {
    dicts.value = response.data;
  })
  .catch((error) => {
    console.log(error);
    ElMessage.error(t("dict.errGetDicts"));
  });
});

</script>

<style scoped>
.navItem {
  margin: auto auto;
}
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
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
