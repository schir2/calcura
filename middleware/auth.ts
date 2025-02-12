export default defineNuxtMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.user){
        await authStore.fetchUser();
    }

    if (!authStore.isAuthenticated){
        return navigateTo('/login')
    }

    if (to.meta.requiresPermission && !authStore.user.permissions.includes(to.meta.requiresPermission)){
        return navigateTo('/unauthorized')
    }
})