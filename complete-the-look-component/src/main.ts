import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import clickOutside from "./components/Popup/helper/click-outside.js";

const app = createApp(App);

app.directive("click-outside", clickOutside);

app.mount("#app");
