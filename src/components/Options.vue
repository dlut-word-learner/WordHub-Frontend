<template>
  <el-form label-position="left" label-width="50%">
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
    <el-form-item label="语言">
      <el-select v-model="optionsStore.lang">
        <el-option
          v-for="lang in languages"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../scripts/optionsStore";

const optionsStore = useOptionsStore();

const languages = [
  { value: "zh-cn", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];
</script>

<style scoped></style>
