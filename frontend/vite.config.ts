/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Component tests live beside the components they cover, in jsdom.
  test: {
    // Component tests only. Scoped to `src/` so the Playwright specs in `e2e/` -- which
    // match the default `*.spec.ts` pattern -- are left to Playwright.
    include: ["src/**/*.{test,spec}.ts"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: false,
    // Coverage is measured by the sprint's test check and reported as a json-summary the
    // platform reads back for the development dashboard.
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
    },
  },
});
