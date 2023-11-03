<template>
  <el-container>
    <el-aside width="200px">
      <el-menu id="menu" @select="onSelectLang">
        <el-menu-item v-for="[_, abbr] in langs" :index="abbr">
          <div class="navItem">{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main :span="24 - navSpan">
      <!-- <div id="body"> -->
      <el-row class="dictRow">
        <el-col v-for="dict in displayedDicts()" :span="8">
          <el-card class="dictCard">
            <template #header>
              <div class="header">
                <div>{{ dict.name }}</div>
                <div>{{ dict.language }}</div>
              </div>
            </template>
            <el-button @click="learn(dict)">{{ $t("dict.learn") }}</el-button>
            <el-button @click="review(dict)">{{ $t("dict.review") }}</el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-footer id="footer">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="selectedDicts().length"
          hide-on-single-page
        />
      </el-footer>
      <!-- </div> -->
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { DictVo, langs } from "./common";
import { Ref, ref } from "vue";
import { i18n } from "../../main";
import { useI18n } from "vue-i18n";
import { DictAction, useDictStore } from "../../store/dictStore";
import { onMounted } from "vue";
import axios from "axios";
import router from "../../router";
// import { computed } from "vue";

const dicts: Ref<DictVo[]> = ref([]);
const dictStore = useDictStore();
const navSpan = ref(0);
const currLang: Ref<string> = ref("all");
const { t } = useI18n();
const currentPage = ref(1);
const pageSize = ref(12);

onMounted(() => {
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

switch (i18n.global.locale.value) {
  case "zh_cn":
    navSpan.value = 2;
    break;

  case "en":
  case "ja":
    navSpan.value = 3;
    break;
}

function onSelectLang(index: string, _indexPath, _routeResult): void {
  currLang.value = index;
}

function learn(dict: DictVo): void {
  dictStore.action = DictAction.Learn;
  dictStore.id = dict.id;
  if (langs.has(dict.language))
    dictStore.lang = langs.get(dict.language) as string;

  router.push("/learn");
}

function review(dict: DictVo): void {
  dictStore.action = DictAction.Review;
  dictStore.id = dict.id;
  if (langs.has(dict.language))
    dictStore.lang = langs.get(dict.language) as string;

  router.push("/learn");
}
function selectedDicts(): DictVo[] {
  return dicts.value.filter(
    (x) => currLang.value == "all" || currLang.value == langs.get(x.language),
  );
}
function displayedDicts(): DictVo[] {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return selectedDicts().slice(start, end);
}
</script>

<style scoped>
.navItem {
  margin: auto auto;
}

#menu {
  min-height: 100%;
}
.dictCard {
  width: 400px;
  margin-top: 1em;
  margin-bottom: 1em;
}

.dictRow {
  margin-left: 2em;
  margin-right: 2em;
}

#footer {
  height: 30px;
}
</style>
