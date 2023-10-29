<template>
  <el-row>
    <el-col :span="2">
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
    <el-col :span="22">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import router from "../../router";

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
