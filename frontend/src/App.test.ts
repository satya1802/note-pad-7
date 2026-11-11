import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";

import App, { routes } from "./App.vue";

describe("App", () => {
  it("renders a screen inside the app shell and shows its menu", async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    await router.push("/notes");
    await router.isReady();
    const wrapper = mount(App, { global: { plugins: [router, createPinia()] } });
    await flushPromises();
    expect(wrapper.text()).toContain("Notes");
  });
});
