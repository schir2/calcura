import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import commonjs from '@originjs/vite-plugin-commonjs';

export default defineConfig({
    plugins: [vue(), commonjs()],
    optimizeDeps: {
        include: ['vueuc'],
    },
});