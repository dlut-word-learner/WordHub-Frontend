<template>
  <el-container>
    <el-aside :width="sideWidth">
      <el-menu id="menu" default-active="/user-info/basic" :router="true">
        <el-menu-item index="/user-info/basic" class="menu-item">
          <div>{{ $t("userInfo.nav.basic") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-pwd" class="menu-item">
          <div>{{ $t("userInfo.nav.changePwd") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/change-avatar" class="menu-item">
          <div>{{ $t("userInfo.nav.changeAvatar") }}</div>
        </el-menu-item>
        <el-menu-item index="/user-info/delete-user" class="menu-item">
          <div>{{ $t("userInfo.nav.deleteUser") }}</div>
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
      return "max(12vh, 6vw)";
    case "en":
      return "max(20vh, 10vw)";
    case "ja":
      return "max(24vh, 12vw)";
  }
});
router.push("/user-info/basic");
</script>

<style scoped>
#menu {
  min-height: 100%;
}

.menu-item {
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  height: max(8vh, 4vw);
  font-size: max(2vh, 1vw);
}

#main {
  max-width: 600px;
}
</style>
