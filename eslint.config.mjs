import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".claude/**",
    ".next/**",
    ".venv/**",
    "content/**",
    "docs/**",
    "out/**",
    "public/**",
    "tmp/**",
    "next-env.d.ts",
  ]),
]);
