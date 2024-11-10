// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: [
        '@/assets/css/tailwind.css'
    ],
    devtools: {enabled: true},
    modules: [
        '@nuxt/test-utils/module'
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})
