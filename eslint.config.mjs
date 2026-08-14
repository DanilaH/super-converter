import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  globalIgnores([".astro/**", "dist/**"]),
]);

export default eslintConfig;
