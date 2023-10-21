import { createApp } from "vue";
import "./style.css";
import Login from "./components/Login.vue";
// import ElementPlus from 'element-plus'
import App from "./App.vue";
import router from "./router";
const app = createApp(App);
app.component("Login", Login);
app.use(router);
app.mount("#app");
