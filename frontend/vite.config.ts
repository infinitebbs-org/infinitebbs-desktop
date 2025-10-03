import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
    plugins: [solid()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 1421,
            }
            : undefined,
    },

    // Path aliases
    resolve: {
        alias: {
            "@": "/src",
        },
    },

    // Build optimizations
    build: {
        rollupOptions: {
            plugins: [
                // 在生产构建时移除 console.log
                {
                    name: 'remove-console',
                    transform(code, id) {
                        if (id.indexOf('node_modules') !== -1) return code;
                        // 移除 console.log, console.info, console.debug，但保留 console.error, console.warn
                        return code.replace(/console\.(log|info|debug)\([^)]*\);?/g, '');
                    },
                },
            ],
        },
    },
}));
