import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

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
      'nuxtjs-naive-ui',
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
    app: {
        head: {
            bodyAttrs: {
                class: 'bg-skin-primary text-lg text-skin-base'
            }
        }
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL,
            apiHost: process.env.API_HOST,
        }
    },
    vite: {
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