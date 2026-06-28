export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4
    },

    compatibilityDate: '2026-01-01',
    css: [
        '@/assets/css/tailwind.css',
        'animate.css/animate.min.css',

    ],
    devtools: {enabled: true},
    modules: [
      '@nuxtjs/supabase',
      '@vee-validate/nuxt',
      '@nuxt/test-utils/module',
      '@pinia/nuxt',
      '@vueuse/nuxt',
      '@nuxt/icon',
      '@bg-dev/nuxt-naiveui',
    ],
    naiveui: {
        colorModePreference: 'dark',
        iconDownload: false,
        themeConfig: {
            shared: {},
            light: {},
            dark: {},
        }
    },
    supabase: {
        redirect: false,
        types: '~~/shared/types/database.types.ts',
        redirectOptions: {
            login: '/auth/login',
            exclude: ['/auth/*'],
            callback: '/auth/login'
        }
    },
    imports: {
        dirs: [
            'constants',
            'composables/api',
        ]
    },
    icon: {
        serverBundle: {
            collections: ['uil', 'mdi',]
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}
            ],
            bodyAttrs: {
                class: 'bg-skin-base text-skin-base'
            }
        }
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8000/api',
            apiHost: process.env.API_HOST ?? 'localhost:8000',
        }
    },
    vite: {
        server: {
            allowedHosts: ['calcura.org'],
        },
        optimizeDeps: {
            include: [
                'naive-ui',
                'vueuc',
                'date-fns',
                '@css-render/vue3-ssr',
                '@iconify/vue',
            ],
        },
        ssr: {
            noExternal: ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@iconify/vue'],
        },
    },
    alias: {
        cookie: 'cookie-es',
    },
    nitro: {
        alias: {
            cookie: 'cookie-es',
        },
    },
})