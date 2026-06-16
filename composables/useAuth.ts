export const useAuth = () => {
    const supabase = useSupabaseClient()
    const isAuthenticated = computed(() => !!useSupabaseUser().value)

    async function login(email: string, password: string) {
        const {data, error} = await supabase.auth.signInWithPassword({email, password})
        if (error) throw error
        return data
    }

    async function loginWithGoogle() {
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {redirectTo: `${window.location.origin}/`}
        })
        if (error) throw error
        return data
    }

    async function register(email: string, password: string) {
        const {data, error} = await supabase.auth.signUp({email, password})
        if (error) throw error
        return data
    }

    async function logout() {
        const {error} = await supabase.auth.signOut()
        if (error) throw error
    }

    return {isAuthenticated, login, loginWithGoogle, register, logout}
}