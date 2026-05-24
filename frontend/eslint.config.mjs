import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Let you use any for rapid prototyping
      "@typescript-eslint/ban-ts-comment": "off", // Don't crash builds on standard TS-ignores
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "react-hooks/set-state-in-effect": "off", // Allow setting state inside effects on mount/data-fetch
      "react/no-unescaped-entities": "off", // Allow standard quotes inside JSX/TSX markup
      "prefer-const": "off", // Don't crash builds on let vs const styling differences
      "react-hooks/purity": "off", // Allow standard helper calculations during renders
      "no-use-before-define": "off", // Allow referencing functions before declaration (rely on hoisting)
      "@typescript-eslint/no-use-before-define": "off", // Allow referencing TypeScript helpers before declaration
      "@next/next/no-img-element": "off" // Allow standard HTML img elements for cross-domain avatars
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
