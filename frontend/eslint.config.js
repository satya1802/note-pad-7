import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
      prettier,
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      // `<script lang="ts">` blocks are TypeScript.
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      // Screens are named after their routes ("Login", "Orders"), one word by design.
      "vue/multi-word-component-names": "off",
    },
  },
  {
    // The kit is one module of small components, named as the React kit names them
    // (Button, Select, Table), which screens use as <Button>, never as the HTML element.
    files: ["src/lib/**"],
    rules: {
      "vue/one-component-per-file": "off",
      "vue/no-reserved-component-names": "off",
    },
  },
);
