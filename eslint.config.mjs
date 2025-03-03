import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import reactCompiler from "eslint-plugin-react-compiler";
import jsxRuntimeConfig from "eslint-plugin-react/configs/jsx-runtime.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

/** @type {import('eslint').Linter.Config[]} */
export default [
  // ignore everything mentioned in .gitignore
  includeIgnoreFile(gitignorePath),
  // ignore cloudflare functions
  { ignores: ["functions/"] },
  // extensions we care about
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },

  // plugins from default
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  jsxRuntimeConfig,

  // our own plugins
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
    settings: {
      react: {
        version: "19",
      },
    },
  },
];
