<template>
  <el-col :span="3">
    <el-menu default-active="1">
      <el-menu-item index="/user-info/basic">
        <div>{{ $t("userInfo.nav.basic") }}</div>
      </el-menu-item>
      <el-menu-item index="/user-info/change-pwd">
        <div>{{ $t("userInfo.nav.changePwd") }}</div>
      </el-menu-item>
    </el-menu>
  </el-col>
  <router-view></router-view>
</template>

<script setup lang="ts"></script>

<style scoped></style>
