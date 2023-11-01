<template>
  <el-row>
    <el-col :span="navSpan">
      <el-menu id="menu" default-active="/user-info/basic" :router="true">
        <el-menu-item index="/user-info/basic">
          <div class="navItem">{{ $t("userInfo.nav.basic") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-pwd">
          <div class="navItem">{{ $t("userInfo.nav.changePwd") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-avatar">
          <div class="navItem">{{ $t("userInfo.nav.changeAvatar") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/delete-user">
          <div class="navItem">{{ $t("userInfo.nav.deleteUser") }}</div>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="24 - navSpan">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { i18n } from "../../main";
import router from "../../router";

const navSpan = ref(0);

switch (i18n.global.locale.value) {
  case "zh_cn":
    navSpan.value = 2;
    break;

  case "en":
    navSpan.value = 3;
    break;

  case "ja":
    navSpan.value = 4;
    break;
}

router.push("/user-info/basic");
</script>

<style scoped>
#menu {
  min-height: 100%;
}

.navItem {
  margin: auto auto;
}
</style>
