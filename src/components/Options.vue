<template>
  <el-form>
    <el-form-item label="拼写正确自动切换">
      <el-switch v-model="optionsStore.autoNext" />
    </el-form-item>
    <el-form-item label="隐藏单词">
      <el-switch v-model="optionsStore.isWordHidden" />
    </el-form-item>
    <el-form-item label="启用音效">
      <el-switch v-model="optionsStore.isSoundEnabled" />
    </el-form-item>
    <el-form-item label="音量">
      <el-slider
        v-model="optionsStore.volume"
        :disabled="!optionsStore.isSoundEnabled"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../scripts/optionsStore";

const optionsStore = useOptionsStore();
</script>

<style scoped>
.option {
  margin: 1em;
}
</style>
