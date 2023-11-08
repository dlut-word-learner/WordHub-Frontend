<template>
  <el-container style="height: 100%" direction="vertical">
    <el-main class="learnMain">
      <Transition name="finishAnimation" mode="out-in">
        <el-container class="word-spelling-app" v-if="!isAllFinished">
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
                :word="words?.[index]"
                :isMainShown="[
                  0,
                  !isVisited(index) ||
                    (isCurrWord(index) && isVisited(index) && tries >= 3),
                ]"
                :isMeaningShown="[
                  0,
                  isVisited(index) ||
                    (isCurrWord(index) && isMeaningShown) ||
                    index < currWordIndex,
                ]"
                :isPhoneShown="[
                  0,
                  (isPhoneShown && isCurrWord(index)) || index < currWordIndex,
                ]"
                :isInitialShown="[0, isCurrWord(index) && isInitialShown]"
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
          <el-main id="inputArea">
            <el-input
              size="large"
              v-model="userInput"
              @keypress="typingSound.play()"
              :class="{ shake: shake }"
              :disabled="isAllFinished"
              :clearable="true"
              :maxlength="currWord?.name.length"
              v-if="isVisited(currWordIndex) && tries < 3"
            />
            <el-button
              size="large"
              type="primary"
              @click="showAns"
              v-else-if="words && isAnsButtonShown"
            >
              {{ $t("learn.showAns") }}
            </el-button>
            <div v-if="isMeaningShown && words && !isVisited(currWordIndex)">
              <el-button size="large" type="primary" @click="finishWord(true)">
                {{ $t("learn.know") }}
              </el-button>
              <el-button size="large" @click="finishWord(false)">
                {{ $t("learn.dontknow") }}
              </el-button>
            </div>
            <el-button
              size="large"
              type="primary"
              @click="finishWord(false)"
              v-if="tries >= 3"
            >
              {{ $t("learn.tryAgain") }}
            </el-button>
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
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toKana, toRomaji } from "wanakana";
import { Lang, WordVo, excludeCache } from "./Dicts/common";
import { getWordMain } from "./WordCard";
import { Task, useTaskStore } from "../store/taskStore";
import correctSoundRes from "../assets/audio/correct.wav";
import typingSoundRes from "../assets/audio/typing.wav";
import wrongSoundRes from "../assets/audio/wrong.wav";
import axios from "axios";
import router from "../router";

const props = defineProps<{ lang: Lang; dictId: any; num: any }>();

const { t } = useI18n();
const taskStore = useTaskStore();

const words = ref<WordVo[]>();
const visitedWords: WordVo[] = [];

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

const isAnsButtonShown = ref(true);
const isMeaningShown = ref(false);
const isPhoneShown = ref(false);
const isInitialShown = ref(false);

watch(userInput, (newInput) => {
  if (isInitialShown.value) {
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

const correctSound = new Howl({ src: correctSoundRes });
const wrongSound = new Howl({ src: wrongSoundRes });
const typingSound = new Howl({ src: typingSoundRes });

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
    .get(`/api/dicts/${props.dictId}/learn`, {
      params: {
        num: props.num,
      },
    })
    .then((response) => {
      words.value = response.data;
      taskStore.type = Task.Learn;
      taskStore.url = router.currentRoute.value.fullPath;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("learn.errGetWords"));
      router.back();
    });
};
initData();

const isCurrWord = (index: number) => {
  return index == currWordIndex.value;
};

const isVisited = (index: number) => {
  return words.value ? visitedWords.includes(words.value[index]) : false;
};

function showAns(): void {
  isMeaningShown.value = true;
  isPhoneShown.value = true;
  isAnsButtonShown.value = false;
}

/**
 * @param isKnown - Whether the word is known by user or not
 *
 * isKnown == true -> Upload learning record of the current word
 *                 -> Move the the next word
 *
 * isKnown == false -> Push the current word to the end of word list
 *                  -> Mark the current word as visited
 */
function finishWord(isKnown: boolean): void {
  if (isKnown) {
    axios
      .post(`/api/dicts/${props.dictId}/words/${currWord.value?.id}/learn`, {
        id: currWord.value?.id,
        rating: "easy",
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
        ElMessage.error(t("learn.errUploadRec"));
      });
  } else if (currWord.value) {
    words.value?.push(currWord.value);
    visitedWords.push(currWord.value);
  }

  goToNextWord();
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function goToNextWord(): void {
  isMeaningShown.value = false;
  isPhoneShown.value = false;
  isInitialShown.value = false;
  isAnsButtonShown.value = true;
  isCurrCorrect.value = false;
  tries.value = 0;

  if (words.value && currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value != 0) visibleWordIndexes.value?.shift();
    currWordIndex.value++;

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
      message: t("learn.correctSpelling"),
      duration: 500,
      type: "success",
    });

    correctSound.play();
    isCurrCorrect.value = true;
    setTimeout(finishWord, 500, true);
  } else {
    ElMessage({
      message: t("learn.wrongSpelling"),
      duration: 500,
      type: "error",
    });

    shakeWord();
    wrongSound.play();
    userInput.value = "";
    tries.value++;

    switch (tries.value) {
      case 1:
        if (props.lang == Lang.English) isPhoneShown.value = true;
        break;
      case 2:
        if (props.lang == Lang.English) isInitialShown.value = true;
        else if (props.lang == Lang.Japanese) {
          isInitialShown.value = true;
          isPhoneShown.value = true;
        }
        break;
      case 3:
        showAns();
        break;
    }
  }
}

function goBack(): void {
  taskStore.type = Task.None;
  router.push("/dicts");
}
</script>

<style scoped>
.word-spelling-app {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 76vh;
  padding: 20px;
  gap: 2px;
  font-family: Arial, sans-serif;
  transition: all 0.5s ease;
}

.learnMain {
  padding: 0;
  flex: 23;
}

.words {
  margin: 10px;
  padding: 0 20px;
  width: 96%;
  min-height: 33vw;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
  flex: 8 0 auto;
}

.word-card-instance {
  margin: 0.5% 1%;
  display: inline-block;
  transform-origin: center center 20px;
  transform-style: preserve-3d;
}

.word-card-instance:hover {
  scale: 1.05;
}

.pre-word-card {
  transform: rotateY(-5deg);
}

.next-word-card {
  transform: rotateY(5deg);
}

#progressBar {
  margin-top: 1em;
}

#inputArea {
  width: 25em;
  text-align: center;
  margin: auto auto;
}

.result {
  margin-top: 15%;
  transition: all 0.5s ease;
  align-items: center;
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.finishAnimation-move,
.finishAnimation-enter-active,
.finishAnimation-leave-active {
  transition: all 0.35s ease;
}

.finishAnimation-enter-from {
  opacity: 0;
}

.finishAnimation-leave-to {
  transform: translateY(-300px);
  opacity: 0;
}

.visibleWordCards-enter-from,
.visibleWordCards-leave-to {
  opacity: 0;
  scale: 0.1;
}

.visibleWordCards-move,
.visibleWordCards-leave-active,
.visibleWordCards-enter-active {
  transition: all 0.5s ease;
}

.visibleWordCards-leave-active {
  position: absolute;
  z-index: -1;
}
</style>
