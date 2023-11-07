<template>
  <el-container id="selectDictContainer">
    <el-aside :width="sideWidth" class="elAside">
      <el-menu
        @select="onSelectLang"
        default-active="all"
        :background-color="'rgba(255,255,255,0)'"
      >
        <el-menu-item :index="'all'" class="menu-item">
          <div>{{ $t(`dict.all`) }}</div>
        </el-menu-item>
        <el-menu-item
          v-for="abbr in Object.values(Lang)"
          :index="abbr"
          class="menu-item"
        >
          <div>{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="dictsMain">
      <el-row class="dictRow" :gutter="10">
        <TransitionGroup name="dictsTrans">
          <el-col
            v-for="(dict, index) in displayedDicts()"
            :key="dict.id"
            :span="8"
          >
            <el-card
              class="dictCard"
              :class="{ dictCard1: index % 2 == 0, dictCard2: index % 2 == 1 }"
            >
              <template #header>
                <div>
                  <div class="dictName">{{ dict.name }}</div>
                  <div class="dictLang">{{ dict.language }}</div>
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
        </TransitionGroup>
      </el-row>
      <el-footer id="footer">
        <el-pagination
          v-model:current-page="currPage"
          :page-size="pageSize"
          :total="selectedDicts().length"
          :background="true"
          id="pagination"
        />
      </el-footer>
    </el-main>
  </el-container>
  <router-view></router-view>
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

.dictCard {
  margin: 4%;
  border-radius: 12px;
  transition: all 0.2s ease;
}

html.dark .dictCard {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.72);
}

.dictCard:hover {
  scale: 1.02;
  filter: brightness(105%) grayscale(10%);
}

html.dark .dictCard:hover {
  filter: brightness(110%) saturate(120%);
}
.dictCard1 {
  background-image: -moz-linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
  background-image: -webkit-linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
  background-image: linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
}

.dictCard2 {
  background-image: -moz-linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
  background-image: linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
}

html.dark .dictCard1 {
  background-image: -moz-linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
  background-image: -webkit-linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
  background-image: linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
}

html.dark .dictCard2 {
  background-image: -moz-linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
  background-image: -webkit-linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
  background-image: linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
}

.menu-item {
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  height: 80px;
}

.dictRow {
  min-height: 90%;
  overflow: hidden;
  margin: 10px 20px;
}

.dictName {
  font-size: 20px;
}

.dictLang {
  font-size: 18px;
}

.taskButton {
  min-width: 80px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 5px;
  backdrop-filter: blur(5px);
}

html.dark .taskButton {
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
}

#footer {
  position: sticky;
  bottom: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) grayscale(50%);
  height: 50px;
  border-radius: 15px;
  margin: 3px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

html.dark #footer {
  background-color: rgba(41, 50, 54, 0.1);
}

#footer:hover {
  scale: 1.01;
  transition: all 0.5s ease;
}

#pagination {
  line-height: 50px;
}

.dictsMain {
  padding: 10px 50px;
  /* height: 100%; */
}

.dictsTrans-enter-from,
.dictsTrans-leave-to {
  opacity: 0;
  scale: 0.5;
}

.dictsTrans-move,
.dictsTrans-leave-active,
.dictsTrans-enter-active {
  transition: all 0.2s ease;
  /* transition-delay: 0.2s; */
}
.dictsTrans-leave-active {
  position: absolute;
  opacity: 0;
  scale: 0.3;
  z-index: -1;
}

html.dark .taskButton {
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
}

#footer {
  position: sticky;
  bottom: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) grayscale(50%);
  height: 50px;
  border-radius: 15px;
  margin: 3px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

html.dark #footer {
  background-color: rgba(41, 50, 54, 0.1);
}

#footer:hover {
  scale: 1.01;
  transition: all 0.5s ease;
}

#pagination {
  line-height: 50px;
}

.dictsMain {
  padding: 10px 50px;
  /* height: 100%; */
}

.dictsTrans-enter-from,
.dictsTrans-leave-to {
  opacity: 0;
  scale: 0.5;
}

.dictsTrans-move,
.dictsTrans-leave-active,
.dictsTrans-enter-active {
  transition: all 0.2s ease;
  /* transition-delay: 0.2s; */
}
.dictsTrans-leave-active {
  position: absolute;
  z-index: -1;
}
</style>
