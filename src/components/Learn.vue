<template>
  <div class="word-container" v-if="!isAllFinished">
    <div class="words" v-if="words">
      <TransitionGroup name="visibleWordCards">
        <WordCard
          class="word-card-instance"
          :class="{
            'pre-word-card': isCurrWord(index + 1),
            'next-word-card': isCurrWord(index - 1),
          }"
          v-for="index in visibleWordIndex"
          :key="index"
          :word="words?.[index]"
          :showMain="
            (showMain && !isVisited(index)) || (tries >= 3 && isVisited(index))
          "
          :showMeaning="
            (showMeaning && isCurrWord(index)) ||
            index < currWordIndex ||
            isVisited(index)
          "
          :showPhone="
            (showPhone && isCurrWord(index)) ||
            index < currWordIndex ||
            isVisited(index)
          "
          :showInitial="showInitial"
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
    </div>
    <div id="inputArea">
      <el-input
        size="large"
        v-model="userInput"
        @keypress="typingSound.play()"
        :class="{ shake: shake }"
        :disabled="isAllFinished"
        :clearable="true"
        v-if="words && isVisited(currWordIndex) && tries < 3"
      />
      <el-button
        type="primary"
        @click="showAns"
        v-else-if="words && showAnsButton"
      >
        {{ $t("learn.showAns") }}
      </el-button>
      <div v-if="showMeaning && words && !isVisited(currWordIndex)">
        <el-button type="primary" @click="finishWord(true)">
          {{ $t("learn.know") }}
        </el-button>
        <el-button @click="finishWord(false)">
          {{ $t("learn.dontknow") }}
        </el-button>
      </div>
    </div>
  </div>
  <div v-else>
    <el-result icon="success" :title="$t('learn.finishPrompt')"> </el-result>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
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
const visibleWordIndex = ref([0, 1]);

const currWord = computed(() => {
  return words.value?.[currWordIndex.value];
});

const tries = ref(0); // Maximum tries: 3

const userInput = ref("");
const isCurrCorrect = ref(false);
const isAllFinished = ref(false);
const shake = ref(false);

const showAnsButton = ref(true);
const showMain = ref(true);
const showMeaning = ref(false);
const showPhone = ref(false);
const showInitial = ref<boolean>();

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
      // if (words.value)
      //   visibleWords.value = [words.value[0], words.value[1]];

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
  showMeaning.value = true;
  showPhone.value = true;
  showAnsButton.value = false;
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
  if (!words.value) return;

  showMeaning.value = false;
  showPhone.value = false;
  showAnsButton.value = true;

  if (isKnown) {
    axios
      .post(
        `/api/dicts/${props.dictId}/words/${
          words.value[currWordIndex.value].id
        }/learn`,
        {
          id: words.value[currWordIndex.value].id,
          rating: "easy", // ?
        },
      )
      .then(() => {
        // ?
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error(t("learn.errUploadRec"));
      });
  } else {
    words.value.push(words.value[currWordIndex.value]);
    visitedWords.push(words.value[currWordIndex.value]);
  }

  if (currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value != 0) visibleWordIndex.value?.shift();
    currWordIndex.value++;

    if (currWordIndex.value + 1 < words.value.length)
      visibleWordIndex.value?.push(currWordIndex.value + 1);
  } else {
    currWordIndex.value++;
    visibleWordIndex.value = [];
    isAllFinished.value = true;
  }
}

function shakeWord(): void {
  shake.value = true;
  setTimeout(() => (shake.value = false), 400);
}

function goToNextWord(): void {
  if (words.value && currWordIndex.value + 1 < words.value.length) {
    if (currWordIndex.value != 0) visibleWordIndex.value?.shift();
    currWordIndex.value++;

    if (currWordIndex.value + 1 < words.value.length)
      visibleWordIndex.value?.push(currWordIndex.value + 1);

    userInput.value = "";
  } else {
    currWordIndex.value++;
    visibleWordIndex.value = [];
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
    setTimeout(goToNextWord, 500);
    isCurrCorrect.value = true;
    tries.value = 0;
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
        if (props.lang == Lang.English) showPhone.value = true;
        break;
      case 2:
        if (props.lang == Lang.English) showInitial.value = true;
        else if (props.lang == Lang.Japanese) {
          showInitial.value = true;
          showPhone.value = true;
        }
        break;
      case 3:
        showMain.value = true;
        showAns();
        break;
    }
  }
}
</script>

<style scoped>
.word-spelling-app {
  text-align: center;
  margin: 20px 30px;
  font-family: Arial, sans-serif;
}

.word-container {
  margin: 20px;
  width: 98%;
  text-align: center;
}

.words {
  /* margin-bottom: 1.5em; */
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
}

.word-card-instance {
  margin: 10px;
  display: inline-block;
  transform-origin: center center 20px;
  transform-style: preserve-3d;
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

.stats-container {
  margin-top: 1em;
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

/* .visibleWordCards-move,

.visibleWordCards-leave-active {
  transition: all 3s ease-out;
  
} */
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
}
</style>
