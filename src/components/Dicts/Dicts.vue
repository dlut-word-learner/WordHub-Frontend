<template>
  <el-row>
    <el-col :span="2">
      <el-menu v-for="lang in langs" default-active="/dicts/all" :router="true">
        <el-menu-item :index="`/dicts/${lang.abbr}`">
          <div>{{ $t(`dict.${lang.abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="22">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { langs } from "./common";
import router from "../../router";

router.push("/dicts/all");
</script>

<style scoped></style>
