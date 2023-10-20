<template>
  <router-view></router-view>
  <div>
    <img src="/wordhub.png" width="100" height="100" />
    <h2>用户登录</h2>
    <form>
      <div>
        <label for="username">用户名：</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <br />
      <div>
        <label for="password">密码：</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <br />
    </form>
    <button @click="login">登录</button>
  </div>

  <!-- <div> <router-link :to="{name:'UI'}" >Login</router-link></div> -->
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");

function login() {
  if (username.value === "" || password.value === "")
    alert("请输入用户名和密码");
  else if (username.value === "user" && password.value === "password")
    alert("登录成功");
  else alert("用户名或密码错误");
}
</script>

<style scoped>
form {
  display: table;
}

div {
  display: table-row;
}

label {
  display: table-cell;
  text-align: right;
}

input {
  display: table-cell;
}

.dropbtn {
  background-color: #4caf50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
</style>
