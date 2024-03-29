<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <el-container id="selectDictContainer">
    <el-aside width="auto">
      <el-menu
        @select="onSelectDictsCategory"
        default-active="all"
        :background-color="'rgba(255,255,255,0)'"
        id="elMenu"
      >
        <el-menu-item :index="'recentlyUsed'" class="menu-item">
          <div>{{ $t(`dict.recentlyUsed`) }}</div>
        </el-menu-item>
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
            v-for="(dict, index) in displayedDicts"
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
                  <div class="numToReview" v-if="numToReview.get(dict.id)">
                    {{
                      t("dict.numToReview") + ": " + numToReview.get(dict.id)
                    }}
                  </div>
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
          :total="selectedDicts.length"
          :background="true"
          id="pagination"
        />
      </el-footer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { DictVo, excludeCache, Lang, sortWithIntersection } from "./common";
import { Ref, ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useOptionsStore } from "../../store/optionsStore";
import { Task, useTaskStore } from "../../store/taskStore";
import { useHistoryStore } from "../../store/historyStore";
import { useUserStore } from "../../store/userStore";
import { throwError } from "../Error";
import axios from "axios";
import router from "../../router";

const optionsStore = useOptionsStore();
const taskStore = useTaskStore();
const historyStore = useHistoryStore();
const userStore = useUserStore();

const dicts: Ref<DictVo[]> = ref([]);
const currCate: Ref<string> = ref("all");
const { t } = useI18n();

const currPage = ref(1);
const pageSize = ref(12);
const numToReview = ref(new Map<number, number>());

onMounted(async () => {
  try {
    const { data: dictsData } = await axios.get("/api/dicts");
    dicts.value = dictsData;
    historyStore.updateRecentlyUsedDicts();
    if(userStore.userVo){
      const promises = dicts.value.map(async (dict) => {
        const { data: reviewNum } = await axios.get(
          `/api/dicts/${dict.id}/review/num`,
        );
        // Typescript set get 才支持异步，[]访问不支持！！！
        numToReview.value.set(dict.id, reviewNum);
        // console.log(dict.id, " : ", numToReview.value[dict.id]);
      });
      await Promise.all(promises);
    }
  } catch (error) {
    throwError(error, "dict.errGetDicts", t);
  }
});

// const sideWidth = computed(() => {
//   switch (i18n.global.locale) {
//     case "zh-CN":
//       return "max(12vh, 6vw)";
//     case "en":
//       return "max(16vh, 10vw)";
//     case "ja":
//       return "max(14vh, 7vw)";
//   }
// });

function onSelectDictsCategory(index: string, _indexPath, _routeResult): void {
  currCate.value = index;
}

function tryTask(dict: DictVo, task: Task): void {
  if (taskStore.type != Task.None) {
    console.log(taskStore.url);
    if (
      taskStore.type == task &&
      taskStore.url.includes(Lang[dict.language]) &&
      taskStore.url.includes(dict.id.toString())
    ) {
      continueCurrTask();
      ElMessage.info(t("dict.continueCurrTask"));
      return;
    }
    ElMessageBox.confirm(t("dict.currTaskPrompt"), t("dict.prompt"), {
      distinguishCancelAndClose: true,
      confirmButtonText: t("dict.startNewTask"),
      cancelButtonText: t("dict.continueCurrTask"),
      buttonSize: "large",
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
  taskStore.type = Task.None;
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

const selectedDicts = computed(() => {
  // console.log(historyStore.recentlyUsedDicts);
  return sortWithIntersection(
    dicts.value.filter((x) => {
      if (currCate.value == "recentlyUsed") {
        return historyStore.isRecentlyUsed(x);
      } else
        return currCate.value == "all" || currCate.value == Lang[x.language];
    }),
    historyStore.recentlyUsedDicts,
  );
});

const displayedDicts = computed(() => {
  const start = (currPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return selectedDicts.value.slice(start, end);
});
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
  box-shadow: 0px 0px 10px 5px rgba(92, 44, 169, 0.1);
}

.dictCard:hover {
  scale: 1.02;
  box-shadow: 0px 0px 15px 5px rgba(18, 18, 18, 0.1);
  filter: brightness(105%) grayscale(10%);
}

html.dark .dictCard:hover {
  filter: brightness(110%) saturate(120%);
  box-shadow: 0px 0px 20px 5px rgba(92, 44, 169, 0.3);
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
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  height: max(8vh, 4vw);
  /* width: 3vh; */
  font-size: max(2vh, 1vw);
}

.dictRow {
  align-items: center;
  justify-content: center;
  min-height: 90%;
  overflow: hidden;
  padding: 20px;
  margin: 10px 20px;
}

.dictName {
  font-size: 20px;
}

.dictLang {
  font-size: 18px;
}

.numToReview {
  margin-top: 10px;
  margin-bottom: 0;
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

#elMenu {
  padding: 0 20px;
}
</style>
