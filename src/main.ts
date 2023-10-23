import { createApp } from "vue";
import "./style.css";
import Login from "./components/Login.vue";
import Options from "./components/Options.vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.component("Login", Login);
app.component("Options", Options);
app.use(router);
app.use(pinia);
app.mount("#app");
