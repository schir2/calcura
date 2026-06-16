import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        environment: "happy-dom",
        exclude: ['.claude/**', 'node_modules/**'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['node_modules', 'dist', 'test-helpers/**/*.ts'],
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            all:true,
        },
    },
})
