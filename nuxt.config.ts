import AutoImport from 'unplugin-auto-import/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: [
        '@/assets/css/tailwind.css',
        'animate.css/animate.min.css',

    ],
    build: {
        transpile: ['vueuc'],
    },
    experimental: {
        asyncContext: true,
    },
    devtools: {enabled: true},
    modules: [
        '@vee-validate/nuxt',
        '@nuxt/test-utils/module',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxt/icon',
        'nuxtjs-naive-ui',
    ],
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
        plugins: [
            AutoImport({
                imports: [
                    {
                        'naive-ui': [
                            'useDialog',
                            'useMessage',
                            'useNotification',
                            'useLoadingBar',
                        ]
                    }
                ]
            }),
            Components({
                resolvers: [NaiveUiResolver()],
                dts: true,
            })
        ]
    }

})