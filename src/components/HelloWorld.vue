<template>
  <RouterView>
    <div>
      <h2>用户登录</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  </RouterView>

  <!-- <div> <router-link :to="{name:'UI'}" >Login</router-link></div> -->
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");

function login() {
  // 在这里处理登录逻辑，例如验证用户信息
  if (username.value === "user" && password.value === "password") {
    alert("登录成功");
  } else {
    alert("登录失败");
  }
}
</script>
<style scoped></style>
