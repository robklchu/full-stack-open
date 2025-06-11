import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    ignores: ["dist/**"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
      ecmaVersion: "latest",
    },
    plugins: {
      js,
      "@stylistic": stylistic,
    },
    extends: ["js/recommended"],
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/no-trailing-spaces": ["error", { ignoreComments: true }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
      eqeqeq: ["error", "always"],
      "no-console": "off",
    },
  },
]);
