export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: [
        '@/assets/css/tailwind.css',
        'animate.css/animate.min.css',

    ],
    devtools: {enabled: true},
    modules: [
        '@vee-validate/nuxt',
        '@nuxt/test-utils/module',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxt/icon',
        '@prisma/nuxt',
    ],
    icon:{
        serverBundle: {
            collections: ['uil',]
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    prisma: {
        generateClient: false,
        autoSetupPrisma: false,
    },
    app: {
        head: {
            bodyAttrs: {
                class: 'bg-skin-primary text-lg text-skin-base'
            }
        }
    },

})