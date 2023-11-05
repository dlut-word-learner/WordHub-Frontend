<template>
  <el-container>
    <el-aside :width="`${sideWidth}px`">
      <el-menu id="menu" @select="onSelectLang" default-active="all">
        <el-menu-item :index="'all'">
          <div class="navItem">{{ $t(`dict.all`) }}</div>
        </el-menu-item>
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
            <el-button @click="tryTask(dict, Task.Learn)">
              {{ $t("dict.learn") }}
            </el-button>
            <el-button @click="tryTask(dict, Task.Review)">
              {{ $t("dict.review") }}
            </el-button>
            <el-button @click="tryTask(dict, Task.QwertyMode)">
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
    <el-dialog v-model="confirmVisible" :title="$t('dict.prompt')" width="30%">
      <span>{{ $t("dict.currTaskPrompt") }}</span>
      <template #footer>
        <span>
          <el-button @click="startNewTask">
            {{ $t("dict.startNewTask") }}
          </el-button>
          <el-button type="primary" @click="continueCurrTask">
            {{ $t("dict.continueCurrTask") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { DictVo, excludeCache, langs } from "./common";
import { Ref, ref, reactive, onMounted } from "vue";
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

const sideWidth = ref(0);
const currPage = ref(1);
const pageSize = ref(12);
const confirmVisible = ref(false);

interface NewTask {
  dict?: DictVo;
  task?: Task;
}

const newTask: NewTask = reactive({});

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

function tryTask(dict: DictVo, task: Task): void {
  newTask.dict = dict;
  newTask.task = task;

  if (taskStore.type != Task.None) confirmVisible.value = true;
  else startNewTask();
}

function continueCurrTask(): void {
  confirmVisible.value = false;
  router.push(taskStore.url);
}

function startNewTask(): void {
  if (newTask.dict == undefined || newTask.task == undefined) return;

  confirmVisible.value = false;
  excludeCache.value = Task[taskStore.type];
  const wordsPerRound = ref(0);

  switch (newTask.task) {
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
    name: Task[newTask.task],
    query: {
      lang: langs.get(newTask.dict.language) as string,
      dictId: newTask.dict.id,
      num: wordsPerRound.value,
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
