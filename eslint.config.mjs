import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginRegexp from "eslint-plugin-regexp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),

  // Strict migration rules
  {
    plugins: {
      import: pluginImport,
      unicorn: pluginUnicorn,
      regexp: pluginRegexp,
    },
    rules: {
      // Keep existing Next.js overrides
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-page-custom-font": "off",

      /* ==================== HARD BANS ==================== */
      "no-restricted-imports": ["error", {
        paths: [
          {
            name: "styled-jsx",
            message: "styled-jsx is forbidden during migration. Use @layer recipes in CSS files instead."
          },
          {
            name: "client-only",
            message: "client-only import is forbidden—use server-safe patterns."
          },
        ],
        patterns: [
          {
            group: ["@/styles/components/*"],
            message: "Legacy component CSS can only be imported by (site)/layout.tsx during migration."
          }
        ]
      }],

      /* ==================== IMPORT HYGIENE ==================== */
      // Deterministic order: tokens → primitives → components
      "import/order": ["error", {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "object",
          "type"
        ],
        pathGroups: [
          {
            pattern: "@/styles/tokens/**",
            group: "internal",
            position: "before"
          },
          {
            pattern: "@/styles/primitives/**",
            group: "internal",
            position: "before"
          },
          {
            pattern: "@/styles/components/**",
            group: "internal",
            position: "after"
          }
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        },
        "newlines-between": "always"
      }],

      /* ==================== UNICORN RULES ==================== */
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": "off",

      /* ==================== REGEXP RULES ==================== */
      "regexp/no-useless-escape": "warn",
    }
  },

  // Allow legacy CSS ONLY in (site) layout
  {
    files: ["src/app/(site)/layout.tsx"],
    rules: {
      "no-restricted-imports": "off"
    }
  },

  // (migration) route group defaults to server components
  {
    files: ["src/app/(migration)/**"],
    rules: {
      "unicorn/no-abusive-eslint-disable": "off"
    }
  }
];

export default eslintConfig;
