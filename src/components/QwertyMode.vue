<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <el-container style="height: 100%" direction="vertical">
    <el-collapse-transition>
      <el-header
        class="header"
        v-show="!stopwatch.isRunning.value && !isAllFinished"
      >
        <el-alert
          :title="$t('qwerty.typingToStart')"
          :center="true"
          :show-icon="true"
        />
      </el-header>
    </el-collapse-transition>
    <el-main class="body">
      <Transition name="finishAnimation" mode="out-in">
        <el-container class="word-spelling-app" v-if="!isAllFinished">
          <el-main id="progressBar">
            <el-progress
              :show-text="false"
              :percentage="words ? (currWordIndex / words.length) * 100 : 0"
            />
          </el-main>
          <el-main id="nextWordButton">
            <el-button
              size="large"
              type="primary"
              @click="promptGoToNextWord"
              :disabled="!stopwatch.isRunning"
              v-if="!isAllFinished"
            >
              {{ $t("qwerty.goToNextWord") }}
            </el-button>
          </el-main>
          <el-main id="inputArea">
            <el-input
              size="large"
              v-model="userInput"
              @keypress="typingSound.play()"
              @keydown="startTiming"
              :class="{ shake: shake }"
              :disabled="isAllFinished"
              :clearable="true"
              autofocus
              @keypress.enter="promptGoToNextWord"
              ref="userInputRef"
              :maxlength="currWord?.name.length"
            />
          </el-main>
          <el-main class="words" v-if="words">
            <TransitionGroup name="visibleWordCards">
              <WordCard
                class="word-card-instance"
                :class="{
                  'pre-word-card': isCurrWord(index + 1),
                  'next-word-card': isCurrWord(index - 1),
                  shake: shake && isCurrWord(index),
                }"
                v-for="index in visibleWordIndex"
                :key="index"
                :word="words?.[index]"
                :emphasized="isCurrWord(index)"
                :userInput="
                  isCurrWord(index)
                    ? userInput
                    : index > currWordIndex
                      ? ''
                      : undefined
                "
                :sound="isCurrWord(index) ? currWordSound : undefined"
                :lang="lang"
                @done="inputDone"
              />
            </TransitionGroup>
          </el-main>
        </el-container>
        <el-container
          class="result"
          direction="vertical"
          @keypress.enter="goBack"
          v-else
        >
          <el-main>
            <el-result
              icon="success"
              :title="$t('qwerty.finishPrompt')"
            ></el-result>
          </el-main>
          <el-button type="primary" @click="goBack" size="large">
            {{ $t("qwerty.goBack") }}
          </el-button>
        </el-container>
      </Transition>
    </el-main>
    <el-main class="statsFooter">
      <Stats
        class="stats"
        :stopwatch="stopwatch"
        :words="words"
        :currWordIndex="currWordIndex"
        :tries="tries"
        :skips="skips"
        v-if="words"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onActivated, onDeactivated, nextTick } from "vue";
import { useStopwatch } from "vue-timer-hook";
import { Howl } from "howler";
import { useOptionsStore } from "../store/optionsStore";
import { Task, useTaskStore } from "../store/taskStore";
import { useI18n } from "vue-i18n";
import { isKatakana, toHiragana, toKatakana } from "wanakana";
import { Lang, WordVo, excludeCache } from "./Dicts/common";
import { correctSound, wrongSound, typingSound } from "./SoundEffects";
import { getWordMain } from "./WordCard";
import { throwError } from "./Error";
import WordCard from "./WordCard.vue";
import Stats from "./Stats.vue";
import axios from "axios";
import router from "../router";
import "./wordStyle.css";
import "./animation.css";
import { useUserStore } from "../store/userStore";

const props = defineProps<{ lang: Lang; dictId: any; num: any }>();

const { t } = useI18n();
const optionsStore = useOptionsStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const words = ref<WordVo[]>();
const currWordIndex = ref(0);
const visibleWordIndex = ref<number[]>([]);

const currWord = computed(() => {
  return words.value?.[currWordIndex.value];
});

const isCurrWord = (index: number) => {
  return index == currWordIndex.value;
};

const tries = ref(0);
const skips = ref(0);
const userInput = ref("");

// The spelling of current word is correct, waiting for "Next Word" button to be pressed
const isCurrCorrect = ref(false);
const isAllFinished = ref(false);
const shake = ref(false);
const stopwatch = useStopwatch(0, false);
const userInputRef = ref<HTMLInputElement>();

const currWordSound = computed(() => {
  if (!currWord.value) return undefined;

  const wordName = currWord.value.name;
  switch (props.lang) {
    case Lang.English:
      return new Howl({
        src: `/dictYoudao/dictvoice?le=eng&audio=${wordName}`,
        format: "mp3",
      });
    case Lang.Japanese:
      return new Howl({
        src: `/dictYoudao/dictvoice?le=jap&audio=${
          isKatakana(getWordMain(currWord.value, Lang.Japanese))
            ? toKatakana(wordName)
            : toHiragana(wordName)
        }`,
        format: "mp3",
      });
  }
});

function clear(): void {
  excludeCache.value = Task[Task.QwertyMode];
  taskStore.type = Task.None;
}

const initData = async () => {
  excludeCache.value = "";

  await axios
    .get(`/api/dicts/${props.dictId}/qwerty`, {
      params: {
        num: props.num,
      },
    })
    .then((response) => {
      words.value = response.data;
      taskStore.type = Task.QwertyMode;
      taskStore.url = router.currentRoute.value.fullPath;
      if (!words.value) return;
      if (words.value.length >= 1)
        setTimeout(() => visibleWordIndex.value.push(0), 100);
      if (words.value.length >= 2)
        setTimeout(() => visibleWordIndex.value.push(1), 200);
    })
    .catch((error) => {
      throwError(error, "qwerty.errGetWords", t);
      clear();
      router.back();
    });
};
initData();

onActivated(() => {
  nextTick(() => {
    userInputRef.value?.focus();
  });
});

onDeactivated(() => {
  stopwatch.pause();
});

function startTiming(): void {
  if (!stopwatch.isRunning.value) stopwatch.start();
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function promptGoToNextWord(): void {
  if (isAllFinished.value) return;

  if (!isCurrCorrect.value) {
    ElMessageBox.confirm(t("qwerty.promptGoToNextWord"), t("qwerty.prompt"), {
      confirmButtonText: t("qwerty.confirm"),
      cancelButtonText: t("qwerty.cancel"),
      buttonSize: "large",
    })
      .then((data) => {
        if (data == "confirm") {
          skips.value++;
          goToNextWord();
        }
      })
      .catch(() => {
        return;
      });
  } else goToNextWord();
}

function goToNextWord(): void {
  isCurrCorrect.value = false;
  tries.value++;

  if (words.value && currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value != 0) visibleWordIndex.value?.shift();
    currWordIndex.value++;

    if (currWordIndex.value + 1 < words.value.length)
      visibleWordIndex.value?.push(currWordIndex.value + 1);

    userInput.value = "";
  } else {
    currWordIndex.value++;
    visibleWordIndex.value = [];
    finish();
  }
}

function inputDone(isCorrect: boolean): void {
  if (isCorrect) {
    ElMessage({
      message: t("qwerty.correctSpelling"),
      duration: 500,
      type: "success",
    });

    correctSound.play();

    if (optionsStore.autoNext) setTimeout(goToNextWord, 500);
    else isCurrCorrect.value = true;
  } else {
    ElMessage({
      message: t("qwerty.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    wrongSound.play();
    tries.value++;
    userInput.value = "";
  }
}

function finish(): void {
  isAllFinished.value = true;
  stopwatch.pause();
  if(userStore.userVo){
    axios
      .post(`/api/dicts/${props.dictId}/qwerty`, { num: props.num - skips.value })
      .catch((error) => {
        throwError(error, "learn.errUploadRec", t);
      });
  }
}

function goBack(): void {
  clear();
  router.push("/dicts");
}
</script>

<style scoped>
.header {
  flex: 1;
  z-index: 998;
  position: absolute;
  width: 100%;
}

.statsFooter {
  position: sticky;
  bottom: 0.1vh;
  padding: 15px;
  flex: 4;
  height: 10%;
  transition: all 0.5s ease;
}

#progressBar {
  width: 96%;
  margin: 10px;
  padding: 0;
  flex: 1 0 auto;
}

#inputArea {
  width: 50%;
  padding: 0 10px;
  flex: 2 0 auto;
}

#nextWordButton {
  padding: 0;
  min-width: 120px;
  flex: 1 0 auto;
}

.stats {
  border-radius: 20px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

.stats:hover {
  scale: 1.01;
  transition: all 0.2s ease;
}

.result {
  margin-top: 15%;
  transition: all 0.5s ease;
  align-items: center;
  /* transition-delay: 200ms; */
  /* position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%); */
}
</style>
