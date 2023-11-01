<template>
  <el-row>
    <el-col :span="navSpan">
      <el-menu
        v-for="[_, abbr] in langs"
        default-active="/dicts/all"
        :router="true"
      >
        <el-menu-item :index="`/dicts/${abbr}`">
          <div class="navItem">{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="24 - navSpan">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { langs } from "./common";
import { ref } from "vue";
import { i18n } from "../../main";
import router from "../../router";

const navSpan = ref(0);

switch (i18n.global.locale.value) {
  case "zh_cn":
    navSpan.value = 2;
    break;

  case "en":
  case "ja":
    navSpan.value = 3;
    break;
}

router.push("/dicts/all");
</script>

<style scoped>
.navItem {
  margin: auto auto;
}
</style>
