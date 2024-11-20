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
        'nuxt-feather-icons',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@morev/vue-transitions/nuxt',
        '@formkit/auto-animate/nuxt',
    ],
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
    },
    vueTransitions: {}
})