import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import App, { routes } from "@/App.vue";
import "@/index.css";

// `BASE_URL` is Vite's own build-time constant: "/" normally, and the prefix a live
// preview is served under when the build was run with one.
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

// The notes collection, the current note and the search term are all meant to live in one
// reactive Pinia store shared between the list and editor screens (see the architecture's
// notes on `local_store`); wiring it up here is what lets a screen's `useStore()` resolve.
createApp(App).use(router).use(createPinia()).mount("#root");
