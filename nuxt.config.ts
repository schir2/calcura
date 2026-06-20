import AutoImport from 'unplugin-auto-import/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4
    },

    compatibilityDate: '2026-01-01',
    css: [
        '@/assets/css/tailwind.css',
        'animate.css/animate.min.css',

    ],
    devtools: {enabled: false},
    modules: [
      '@nuxtjs/supabase',
      '@vee-validate/nuxt',
      '@nuxt/test-utils/module',
      '@pinia/nuxt',
      '@vueuse/nuxt',
      '@nuxt/icon',
      'nuxtjs-naive-ui',
    ],
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
            'composables/**'
        ]
    },
    icon: {
        serverBundle: {
            collections: ['uil', 'mdi',]
        }
    },
    build: {
        transpile: ['vueuc', 'naive-ui', '@css-render/vue3-ssr'],
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
        // optimizeDeps: {
        //     include: ['vueuc', 'naive-ui', 'cookie'],
        // },
        // ssr: {
        //     noExternal: ['vueuc', 'naive-ui', '@css-render/vue3-ssr'],
        // },
        plugins: [
            AutoImport({
                imports: [
                    {
                        'naive-ui': [
                            'useDialog',
                            'useMessage',
                            'useNotification',
                            'useLoadingBar'
                        ]
                    }
                ]
            }),
            Components({
                resolvers: [NaiveUiResolver()]
            })
        ]
    },

})