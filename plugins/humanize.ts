import { defineNuxtPlugin } from '#app'
import humanize from 'humanize-plus'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            humanize
        }
    }
})
