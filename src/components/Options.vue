<template>
  <el-form>
    <el-form-item label="拼写正确自动切换">
      <el-switch v-model="store.autoNext" />
    </el-form-item>
    <el-form-item label="隐藏单词">
      <el-switch v-model="store.isWordHidden" />
    </el-form-item>
    <el-form-item label="启用音效">
      <el-switch v-model="store.isSoundEnabled" />
    </el-form-item>
    <el-form-item label="音量">
      <el-slider v-model="store.volume" :disabled="!store.isSoundEnabled" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { optionsStore } from "../scripts/optionsStore";

const store = optionsStore();
</script>

<style scoped>
.option {
  margin: 1em;
}
</style>
