<template>
  <el-col :span="3">
    <el-menu v-for="lang in langs" default-active="1">
      <el-menu-item :index="'/dicts/' + lang">
        <div>{{ $t("dict." + lang) }}</div>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<script setup lang="ts">
import { ref } from "vue";

const langs = ref(["English", "Japanese"]);
</script>

<style scoped></style>
