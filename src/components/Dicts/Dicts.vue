<template>
  <el-container>
    <el-aside :width="`${sideWidth}px`">
      <el-menu id="menu" @select="onSelectLang">
        <el-menu-item v-for="[_, abbr] in langs" :index="abbr">
          <div class="navItem">{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
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
            <el-button @click="qwertyMode(dict)">
              {{ $t("dict.qwertyMode") }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-footer id="footer">
        <el-pagination
          v-model:current-page="currPage"
          :page-size="pageSize"
          :total="selectedDicts().length"
          hide-on-single-page
        />
      </el-footer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { DictVo, langs } from "./common";
import { Ref, ref } from "vue";
import { i18n } from "../../main";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
import { useOptionsStore } from "../../store/optionsStore";
import axios from "axios";
import router from "../../router";

const optionsStore = useOptionsStore();

const dicts: Ref<DictVo[]> = ref([]);
const currLang: Ref<string> = ref("all");
const { t } = useI18n();

const sideWidth = ref(0);
const currPage = ref(1);
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
    sideWidth.value = 120;
    break;
  case "en":
    sideWidth.value = 160;
    break;
  case "ja":
    sideWidth.value = 140;
    break;
}

function onSelectLang(index: string, _indexPath, _routeResult): void {
  currLang.value = index;
}

function learn(dict: DictVo): void {
  router.push({
    name: "Learn",
    query: {
      lang: langs.get(dict.language) as string,
      dictId: dict.id,
      num: optionsStore.learnWordsPerRound,
    },
  });
}

function review(dict: DictVo): void {
  router.push({
    name: "Review",
    query: {
      lang: langs.get(dict.language) as string,
      dictId: dict.id,
      num: optionsStore.reviewWordsPerRound,
    },
  });
}

function qwertyMode(dict: DictVo): void {
  router.push({
    name: "QwertyMode",
    query: {
      lang: langs.get(dict.language) as string,
      dictId: dict.id,
      num: optionsStore.qwertyWordsPerRound,
    },
  });
}

function selectedDicts(): DictVo[] {
  return dicts.value.filter(
    (x) => currLang.value == "all" || currLang.value == langs.get(x.language),
  );
}

function displayedDicts(): DictVo[] {
  const start = (currPage.value - 1) * pageSize.value;
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
  height: 20px;
}
</style>
