import { createApp } from "vue";
import "./style.css";
import HelloWorld from "./components/HelloWorld.vue";
// import ElementPlus from 'element-plus'
import App from "./App.vue";
import router from "./router";
const app = createApp(App);
app.component("HelloWorld", HelloWorld);
app.mount("#app");
app.use(router);
