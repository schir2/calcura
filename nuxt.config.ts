export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: [
        '@/assets/css/tailwind.css'
    ],
    devtools: {enabled: true},
    modules: ['@nuxt/test-utils/module', 'nuxt-feather-icons', '@pinia/nuxt',],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            bodyAttrs: {
                class: 'bg-skin-primary text-lg text-skin-base'
            }
        }
    }
})