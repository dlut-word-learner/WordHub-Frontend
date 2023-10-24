import { createApp } from "vue";
import "./style.css";
import Login from "./components/Login.vue";
import Options from "./components/Options.vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createI18n } from "vue-i18n";
import { messages } from "./lang/msg";

const app = createApp(App);
const pinia = createPinia().use(piniaPluginPersistedstate);

export const i18n = createI18n({
  legacy: false,
  locale: "zh_cn",
  fallbackLocale: "en",
  messages,
});

app
  .component("Login", Login)
  .component("Options", Options)
  .use(router)
  .use(pinia)
  .use(i18n)
  .mount("#app");
