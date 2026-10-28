import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
globalIgnores(["dist", "server/node_modules"]),

{
files: ["**/*.{js,jsx}"],
extends: [js.configs.recommended],
languageOptions: {
ecmaVersion: "latest",
globals: globals.browser,
parserOptions: {
ecmaFeatures: {
jsx: true,
},
sourceType: "module",
},
},
},

{
files: ["src/**/*.{js,jsx}"],
plugins: {
"react-hooks": reactHooks,
"react-refresh": reactRefresh,
},
rules: {
...reactHooks.configs.flat.recommended.rules,
"react-refresh/only-export-components": [
"warn",
{ allowConstantExport: true },
],
},
},

{
files: ["server/**/*.js"],
languageOptions: {
sourceType: "commonjs",
globals: globals.node,
},
},
]);
