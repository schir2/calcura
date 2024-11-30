import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        coverage: {
            provider: 'v8' // or 'v8'
        },
    },
})
