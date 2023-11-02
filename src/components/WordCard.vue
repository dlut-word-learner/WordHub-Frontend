<template>
  <el-card id="word" :body-style="{ padding: '0px' }" v-if="word">
    <template #header v-if="userInput==undefined || !optionsStore.isWordHidden">
      <div class="wordMain">{{ getWordMain(word) }}</div>
    </template>
    <template #header v-else>
      <div class="wordMain">
        {{ hiddenWord }}
      </div>
    </template>
    <div class="wordItem">
      {{ getWordPhone(word) }}
      <img
        src="../assets/img/speaker.png"
        class="speaker"
        @click="playWordSound"
      />
    </div>
    <div class="wordItem" v-if="!optionsStore.isMeaningHidden">
      <div v-for="meaning in word?.extension.meanings">
        {{ meaning }}
      </div>
    </div>
  </el-card>

  <!-- <el-card
    id="adjWord"
    :body-style="{ padding: '0px' }"
    v-if="word && optionsStore.showPrevNext"
  >
    <template #header>
      <div class="adjWordMain">{{ getWordMain(word) }}</div>
    </template>
    <div class="adjWordItem">{{ getWordPhone(word) }}</div>
    <div class="adjWordItem" v-if="!optionsStore.isMeaningHidden">
      <div v-for="meaning in word.extension.meanings">
        {{ meaning }}
      </div>
    </div>
  </el-card> -->
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { WordVo } from "./Dicts/common";
import { getWordMain, getWordPhone, playWordSound } from "./WordCard";
import { ref, watch } from "vue";
const hiddenWord = ref("");
const optionsStore = useOptionsStore();

const props = defineProps<{
  word: WordVo | null;
  // 如果是后面的词则为""，如果是前面的词则为undefined
  userInput?: string;
}>();

const emits = defineEmits<{
  (e: 'done', correct: boolean): void
}>()

watch(()=>props.userInput, (newInput, _oldInput)=>{
  if(newInput==undefined || props.word == null)return ;
  if(optionsStore.isWordHidden){
    hiddenWord.value =
      newInput + "_ ".repeat(props.word.name.length - newInput.length);
  }
  
  if (newInput.length == props.word.name.length){
    console.log(`word input done: ${newInput.toLowerCase()} === ${props.word.name}: ${newInput.toLowerCase()===props.word.name}`);
    emits('done', newInput.toLowerCase() === props.word.name);
  }
},
{
  immediate: true
});

</script>

<style scoped>
#adjWord {
  width: 320px;
  margin: auto auto;
}

.wordMain {
  font-size: 3em;
  font-weight: bold;
}

.adjWordMain,
.wordItem {
  font-size: 1.5em;
}

.adjWordItem {
  font-size: 0.9em;
}

.speaker {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>
