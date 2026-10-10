import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for the logic that does not need a browser: formatters, form
 * schemas and the token store. Anything that needs a rendered page is an
 * end-to-end test under `e2e/` instead, where it runs against the real app.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The site shows times in Africa/Lagos, and the date formatters are
    // asserted against that, so the suite must not depend on the machine's
    // own timezone.
    env: { TZ: "Africa/Lagos" },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
