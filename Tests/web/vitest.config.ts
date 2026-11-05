import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("../../Web/src", import.meta.url)),
        },
    },
    define: {
        "import.meta.env.VITE_API_BASE_URL": JSON.stringify("http://api.test"),
    },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["*.test.{ts,tsx}"],
        setupFiles: ["./setup.ts"],
        typecheck: {
            enabled: true,
            tsconfig: "./tsconfig.json",
        },
        restoreMocks: true,
    },
});
