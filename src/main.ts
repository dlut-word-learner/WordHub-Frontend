import { createApp } from "vue";
import "./style.css";
import Login from "./components/Login.vue";
import Options from "./components/Options.vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia().use(piniaPluginPersistedstate);

app.component("Login", Login)
    .component("Options", Options)
    .use(router)
    .use(pinia)
    .mount("#app");
