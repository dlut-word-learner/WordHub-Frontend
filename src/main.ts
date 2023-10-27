import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createI18n } from "vue-i18n";
import { messages } from "./lang/msg";
import { useDark } from "@vueuse/core";
import axios from "axios";

import "./style.css";
import "element-plus/theme-chalk/dark/css-vars.css";

export const isDark = useDark();

const app = createApp(App);
const pinia = createPinia().use(piniaPluginPersistedstate);

export const i18n = createI18n({
  legacy: false,
  locale: "zh_cn",
  fallbackLocale: "en",
  messages,
});

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8181/",
});

app.use(router).use(pinia).use(i18n).mount("#app");
