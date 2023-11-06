<template>
  <el-container id="selectDictContainer">
    <el-aside :width="sideWidth">
      <el-menu @select="onSelectLang" default-active="all">
        <el-menu-item :index="'all'" class="menu-item">
          <div class="navItem">{{ $t(`dict.all`) }}</div>
        </el-menu-item>
        <el-menu-item
          v-for="abbr in Object.values(Lang)"
          :index="abbr"
          class="menu-item"
        >
          <div class="navItem">{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="dictsMain">
      <el-row class="dictRow" :gutter="10">
        <el-col v-for="dict in displayedDicts()" :span="8">
          <el-card class="dictCard">
            <template #header>
              <div class="header">
                <div>{{ dict.name }}</div>
                <div>{{ dict.language }}</div>
              </div>
            </template>
            <el-button @click="tryTask(dict, Task.Learn)" class="taskButton">
              {{ $t("dict.learn") }}
            </el-button>
            <el-button @click="tryTask(dict, Task.Review)" class="taskButton">
              {{ $t("dict.review") }}
            </el-button>
            <el-button
              @click="tryTask(dict, Task.QwertyMode)"
              class="taskButton"
            >
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
          id="pagination"
        />
      </el-footer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { DictVo, excludeCache, Lang } from "./common";
import { Ref, ref, onMounted, computed } from "vue";
import { i18n } from "../../main";
import { useI18n } from "vue-i18n";
import { useOptionsStore } from "../../store/optionsStore";
import { Task, useTaskStore } from "../../store/taskStore";
import axios from "axios";
import router from "../../router";

const optionsStore = useOptionsStore();
const taskStore = useTaskStore();

const dicts: Ref<DictVo[]> = ref([]);
const currLang: Ref<string> = ref("all");
const { t } = useI18n();

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

const sideWidth = computed(() => {
  switch (i18n.global.locale.value) {
    case "zh_cn":
      return "120px";
    case "en":
      return "160px";
    case "ja":
      return "140px";
  }
});

function onSelectLang(index: string, _indexPath, _routeResult): void {
  currLang.value = index;
}

function tryTask(dict: DictVo, task: Task): void {
  if (taskStore.type != Task.None) {
    ElMessageBox.confirm(t("dict.currTaskPrompt"), t("dict.prompt"), {
      distinguishCancelAndClose: true,
      confirmButtonText: t("dict.startNewTask"),
      cancelButtonText: t("dict.continueCurrTask"),
    })
      .then(() => {
        console.log("confirm");
        startNewTask(dict, task);
      })
      .catch((data) => {
        if (data == "cancel") continueCurrTask();
      });
  } else startNewTask(dict, task);
}

function continueCurrTask(): void {
  if (taskStore.url != "") router.push(taskStore.url);
  else console.error("No current task running.");
}

function startNewTask(dict: DictVo, task: Task): void {
  excludeCache.value = Task[taskStore.type];
  const wordsPerRound = ref(0);

  switch (task) {
    case Task.Learn:
      wordsPerRound.value = optionsStore.learnWordsPerRound;
      break;
    case Task.Review:
      wordsPerRound.value = optionsStore.reviewWordsPerRound;
      break;
    case Task.QwertyMode:
      wordsPerRound.value = optionsStore.qwertyWordsPerRound;
      break;
  }

  router.push({
    name: Task[task],
    query: {
      lang: Lang[dict.language],
      dictId: dict.id,
      num: wordsPerRound.value,
    },
  });
}

function selectedDicts(): DictVo[] {
  return dicts.value.filter(
    (x) => currLang.value == "all" || currLang.value == Lang[x.language],
  );
}

function displayedDicts(): DictVo[] {
  const start = (currPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return selectedDicts().slice(start, end);
}
</script>

<style scoped>
#selectDictContainer {
  height: 100%;
  padding: 0;
}

.navItem {
  margin: auto auto;
}

.dictCard {
  /* width: 95%; */
  margin: 5px;
}

.menu-item {
  height: 80px;
}

.dictRow {
  min-height: 90%;
  overflow: hidden;
  margin: 10px 20px;
}

.taskButton {
  margin: 5px;
}

#footer {
  position: sticky;
  bottom: 20px;
  background-color: white;
  height: 35px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
}

#pagination {
  line-height: 35px;
}

.dictsMain {
  padding: 20px;
  height: 100%;
}
</style>
