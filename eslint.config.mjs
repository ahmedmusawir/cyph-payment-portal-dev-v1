import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// APBM007A tooling fix: `next lint` was removed in Next 16, so the portal had no working lint.
// Same flat configuration as OwedBook (eslint-config-next@16 ships native flat configs).
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts", "agent_docs/**", "test-results/**", "playwright-report/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Inherited kit and tooling files, left as they are (scope discipline). Each exception is narrow and named.
  { files: ["e2e/**"], rules: { "react-hooks/rules-of-hooks": "off" } },                       // Playwright fixtures call `use`, which is not a React hook
  { files: ["tailwind.config.ts", "src/__tests__/**"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  { files: ["src/components/ui/input.tsx", "src/components/ui/textarea.tsx"], rules: { "@typescript-eslint/no-empty-object-type": "off" } },
];

export default eslintConfig;
