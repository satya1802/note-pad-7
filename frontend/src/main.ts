import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App, { routes } from "@/App.vue";
import "@/index.css";

// `BASE_URL` is Vite's own build-time constant: "/" normally, and the prefix a live
// preview is served under when the build was run with one.
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

createApp(App).use(router).mount("#root");
