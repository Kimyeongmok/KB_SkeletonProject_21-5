import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useThemeStore } from "./stores/theme";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const themeStore = useThemeStore(pinia);
themeStore.initTheme();

const authStore = useAuthStore(pinia);
authStore.initialize();

app.use(router);

app.mount("#app");
