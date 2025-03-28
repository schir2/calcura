import { defineNuxtRouteMiddleware } from 'nuxt/app';


export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated){
        return navigateTo('/auth/login')
    }
})