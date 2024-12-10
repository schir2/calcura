export default defineNuxtPlugin(() => {

    const api = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBaseUrl ?? 'http://localhost:8000/api/',
    })
    return {
        provide: {
            api
        }
    }
})
