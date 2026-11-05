import { fileURLToPath } from "node:url";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

const configDirectory = new URL(".", import.meta.url);
const migrations = await readD1Migrations(
    fileURLToPath(new URL("../../backend/api/d1-http/migrations", configDirectory)),
);

export default defineConfig({
    define: {
        __D1_MIGRATIONS__: JSON.stringify(migrations),
    },
    plugins: [
        cloudflareTest({
            wrangler: {
                configPath: fileURLToPath(new URL("./wrangler.test.jsonc", configDirectory)),
            },
        }),
    ],
    test: {
        include: ["*.integration.test.ts"],
    },
});
