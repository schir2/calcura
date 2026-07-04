const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/verify', '/auth/callback', '/auth/unauthorized', '/']

export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
    if (!user.value && !PUBLIC_ROUTES.includes(to.path)) {
        return navigateTo('/auth/login')
    }
})