import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { messages } from "./lang/msg";
import { useDark } from "@vueuse/core";

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

app.use(router).use(pinia).use(i18n).mount("#app");
