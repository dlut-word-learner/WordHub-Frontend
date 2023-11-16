import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { useDark } from "@vueuse/core";
import { i18n } from "./locales";

import "default-passive-events";
import "./style.css";
import "element-plus/theme-chalk/dark/css-vars.css";

export const isDark = useDark({ disableTransition: false });

const app = createApp(App);
const pinia = createPinia().use(piniaPluginPersistedstate);

const style = document.createElement("style");
style.setAttribute("data-animation", "");
document.head.appendChild(style);

app.use(pinia).use(i18n).use(router).mount("#app");
