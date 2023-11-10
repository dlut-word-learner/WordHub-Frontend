<template>
  <el-container>
    <el-aside :width="sideWidth">
      <el-menu id="menu" default-active="/user-info/basic" :router="true">
        <el-menu-item index="/user-info/basic">
          <div class="menu-item">{{ $t("userInfo.nav.basic") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-pwd">
          <div class="menu-item">{{ $t("userInfo.nav.changePwd") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-avatar">
          <div class="menu-item">{{ $t("userInfo.nav.changeAvatar") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/delete-user">
          <div class="menu-item">{{ $t("userInfo.nav.deleteUser") }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view id="main"></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { i18n } from "../../main";
import router from "../../router";
import { computed } from "vue";

const sideWidth = computed(() => {
  switch (i18n.global.locale.value) {
    case "zh_cn":
      return "120px";
    case "en":
      return "180px";
    case "ja":
      return "200px";
  }
});

router.push("/user-info/basic");
</script>

<style scoped>
#menu {
  min-height: 100%;
}

.menu-item {
  margin: auto auto;
  font-size: max(2vh, 1vw);
}

#main {
  max-width: 600px;
}
</style>
