<template>
  <el-container style="height: 100%" direction="vertical">
    <el-main class="learnMain">
      <Transition name="finishAnimation" mode="out-in">
        <el-container class="word-spelling-app" v-if="!isAllFinished">
          <el-main id="inputArea">
            <el-input
              size="large"
              v-model="userInput"
              @keypress="typingSound.play()"
              :class="{ shake: shake }"
              :disabled="isAllFinished"
              :clearable="true"
              :maxlength="currWord?.name.length"
              v-if="tries < 3 && !isCurrCorrect"
            />
            <div v-if="!isForgotten(currWordIndex) && isCurrCorrect">
              <el-button size="large" @click="finishWord(true, Rating.Hard)">
                {{ $t("review.hard") }}
              </el-button>
              <el-button
                size="large"
                type="primary"
                @click="finishWord(true, Rating.Good)"
              >
                {{ $t("review.good") }}
              </el-button>
              <el-button size="large" @click="finishWord(true, Rating.Easy)">
                {{ $t("review.easy") }}
              </el-button>
            </div>
            <el-button
              size="large"
              type="primary"
              @click="finishWord()"
              v-if="tries >= 3"
            >
              {{ $t("review.learnAgain") }}
            </el-button>
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
                v-for="index in visibleWordIndexes"
                :key="index"
                :word="words[index]"
                :isMainShown="[0, isCurrWord(index) && tries >= 3]"
                :isMeaningShown="[0, true]"
                :isPhoneShown="[0, isCurrWord(index) && tries >= 3]"
                :emphasized="isCurrWord(index)"
                :sound="isCurrWord(index) ? currWordSound : undefined"
                :lang="lang"
                :userInput="
                  isCurrWord(index)
                    ? userInput
                    : index > currWordIndex
                    ? ''
                    : undefined
                "
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
              :title="$t('review.finishPrompt')"
            ></el-result>
          </el-main>
          <el-button type="primary" @click="goBack" size="large">
            {{ $t("review.goBack") }}
          </el-button>
        </el-container>
      </Transition>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Task, useTaskStore } from "../store/taskStore";
import { Lang, Rating, WordToReviewVo, excludeCache } from "./Dicts/common";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toKana, toRomaji } from "wanakana";
import { getWordMain } from "./WordCard";
import { correctSound, wrongSound, typingSound } from "./SoundEffects";
import { throwError } from "./Error";
import axios from "axios";
import router from "../router";
import "./wordStyle.css";
import "./animation.css";

const props = defineProps<{ lang: Lang; dictId: any; num: any }>();

const { t } = useI18n();
const taskStore = useTaskStore();

const words = ref<WordToReviewVo[]>();
const forgottenWords: WordToReviewVo[] = [];

const currWordIndex = ref(0);
const visibleWordIndexes = ref([0, 1]);

const currWord = computed(() => {
  return words.value?.[currWordIndex.value];
});

const tries = ref(0); // Maximum tries: 3

const userInput = ref("");
const isCurrCorrect = ref(false);
const isAllFinished = ref(false);
const shake = ref(false);

const isMainShown = ref(false);
const isPhoneShown = ref(false);

watch(userInput, (newInput) => {
  if (tries.value == 2 && !isForgotten(currWordIndex.value)) {
    switch (props.lang) {
      case Lang.English:
        if (currWord.value!.name.length > 1 && newInput == "")
          userInput.value = currWord.value!.name[0];

        break;
      case Lang.Japanese:
        if (toKana(currWord.value?.name).length > 1) {
          const firstKana: string = toRomaji(toKana(currWord.value?.name)[0]);
          if (newInput.length < firstKana.length) userInput.value = firstKana;
        }

        break;
    }
  }
});

const currWordSound = computed(() => {
  if (!currWord.value) return undefined;
  return new Howl({
    src: `/dictYoudao/dictvoice?le=${
      props.lang == Lang.English ? "eng" : "jap"
    }&audio=${getWordMain(currWord.value, props.lang)}`,
    format: "mp3",
  });
});

const initData = async () => {
  excludeCache.value = "";

  await axios
    .get(`/api/dicts/${props.dictId}/review`, {
      params: {
        num: props.num,
      },
    })
    .then((response) => {
      words.value = response.data;
      taskStore.type = Task.Review;
      taskStore.url = router.currentRoute.value.fullPath;
    })
    .catch((error) => {
      throwError(error, "review.errGetWords", t);
      router.back();
    });
};
initData();

const isCurrWord = (index: number) => {
  return index == currWordIndex.value;
};

const isForgotten = (index: number) => {
  return words.value ? forgottenWords.includes(words.value[index]) : false;
};

function showAns(): void {
  isMainShown.value = true;
  isPhoneShown.value = true;
}

/**
 * @param isCorrect - whether spelling of the current word is correct<br/>
 *                    default: ```false```
 *
 * @param rating - valid only when ```isCorrect == true```<br/>
 *                 3 options: Hard / Good / Easy<br/>
 */
function finishWord(isCorrect?: boolean, rating?: Rating): void {
  if (!currWord.value) return;

  if (isCorrect && rating != undefined) {
    axios
      .post(`/api/dicts/${props.dictId}/words/${currWord.value.id}/review`, {
        tick: currWord.value.tick + 1,
        rating: Rating[rating],
      })
      .then(() => {})
      .catch((error) => {
        throwError(error, "review.errUploadRec", t);
      });
  } else if (isCorrect) {
    axios
      .post(`/api/dicts/${props.dictId}/words/${currWord.value.id}/learn`, {
        familiar: false,
      })
      .then(() => {})
      .catch((error) => {
        throwError(error, "review.errUploadRec", t);
      });
  } else {
    words.value?.push(currWord.value);
    forgottenWords.push(currWord.value);
  }

  goToNextWord();
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function goToNextWord(): void {
  isPhoneShown.value = false;
  isCurrCorrect.value = false;
  tries.value = 0;

  if (words.value && currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value++ != 0) visibleWordIndexes.value?.shift();

    if (currWordIndex.value + 1 < words.value.length)
      visibleWordIndexes.value?.push(currWordIndex.value + 1);
    else if (!isCurrCorrect.value) {
      visibleWordIndexes.value?.pop();
      visibleWordIndexes.value?.push(currWordIndex.value);
    }

    userInput.value = "";
  } else {
    currWordIndex.value++;
    visibleWordIndexes.value = [];
    isAllFinished.value = true;
  }
}

function inputDone(isCorrect: boolean): void {
  if (isCorrect) {
    ElMessage({
      message: t("review.correctSpelling"),
      duration: 500,
      type: "success",
    });

    correctSound.play();
    isCurrCorrect.value = true;
    if (isForgotten(currWordIndex.value)) setTimeout(finishWord, 500, true);
  } else {
    ElMessage({
      message: t("review.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    wrongSound.play();
    userInput.value = "";
    if (++tries.value == 3) showAns();
  }
}

function goBack(): void {
  taskStore.type = Task.None;
  router.push("/dicts");
}
</script>

<style scoped>
.result {
  margin-top: 15%;
  transition: all 0.5s ease;
  align-items: center;
}
</style>
