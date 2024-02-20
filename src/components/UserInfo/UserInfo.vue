<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <el-container>
    <el-aside width="auto">
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
import router from "../../router";

router.push("/user-info/basic");
</script>

<style scoped>
#menu {
  padding: 0 15px;
}

.menu-item {
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  height: max(8vh, 4vw);
  font-size: max(2vh, 1vw);
}

#main {
  margin-left: 10px;
  margin-top: 5px;
  max-width: 600px;
}
</style>
