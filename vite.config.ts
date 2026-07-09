import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, PluginOption } from 'vite';

// Skip wayfinder during Docker builds (pre-generated types are committed)
const skipWayfinder = process.env.SKIP_WAYFINDER === 'true';

const plugins: PluginOption[] = [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.tsx'],
        ssr: 'resources/js/ssr.tsx',
        refresh: true,
    }),
    react({
        babel: {
            plugins: ['babel-plugin-react-compiler'],
        },
    }),
    tailwindcss(),
    VitePWA({
        strategies: 'injectManifest',
        srcDir: 'resources/js',
        filename: 'sw.ts',
        injectRegister: false,
        manifest: false,
        buildBase: '/build/',
    }),
];

// Only include wayfinder if not skipped (Docker builds skip this)
if (!skipWayfinder) {
    plugins.push(wayfinder({
        formVariants: true,
    }));
}

export default defineConfig({
    plugins,
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: '0.0.0.0', // Allow connections from Docker
        port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
        strictPort: true,
        cors: true, // Allow cross-origin requests from any subdomain
        origin: `http://localhost:${process.env.VITE_PORT || 5173}`, // Absolute URL for assets
        headers: {
            'Service-Worker-Allowed': '/',
        },
        watch: {
            usePolling: true, // Required for Docker file watching
        },
        hmr: {
            host: 'localhost', // HMR connects via browser (localhost)
            clientPort: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
        },
    },
});
