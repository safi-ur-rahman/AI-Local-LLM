import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // This helps prevent some circular reference issues during resolution
  resolvePluginsRelativeTo: __dirname, 
});

const eslintConfig = [
  // Pull in the Next.js config via the bridge
  ...compat.extends("next/core-web-vitals"),
  {
    // Apply Prettier rules separately to avoid clashing with the bridge
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
  {
    // Ignore build artifacts and node_modules
    ignores: [".next/*", "node_modules/*", "dist/*"],
  }
];

export default eslintConfig;