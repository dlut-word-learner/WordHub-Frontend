<script setup lang="ts"></script>

<template>
  <div id="nav">
    <router-link :to="{ name: 'Login' }">Login</router-link>
    <router-link style="margin-left: 10px" :to="{ name: 'UI' }">UI</router-link>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding-right: 10px;
}

#nav a:not(:first-child) {
  border-left: 1px solid #2c3e50;
  padding-left: 30px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
