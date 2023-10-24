<template>
  <router-view></router-view>
  <div>
    <img src="/wordhub.png" width="100" height="100" />
    <h2>用户登录</h2>
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input type="text" id="username" v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="text" id="password" v-model="form.password" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useLoginStore } from "../scripts/loginStore";

const form = reactive({
  username: "",
  password: "",
});

const loginStore = useLoginStore();

function login() {
  if (loginStore.online) {
    ElMessage.info("您已登录");
    return;
  }

  if (form.username === "" || form.password === "")
    ElMessage.info("请输入用户名和密码");
  else if (form.username === "user" && form.password === "password") {
    loginStore.username = form.username;
    loginStore.password = form.password;
    loginStore.online = true;
    ElMessage.success("登录成功");
  } else ElMessage.error("用户名或密码错误");
}
</script>

<style scoped></style>
