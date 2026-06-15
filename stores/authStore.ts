import type { Session, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
    const session = ref<Session | null>(null)
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => session.value !== null)

    // Initialize from Supabase onAuthStateChange
    function initialize() {
        const supabase = useSupabaseClient()
        supabase.auth.getSession().then(({ data }) => {
            session.value = data.session
            user.value = data.session?.user ?? null
        })
        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession
            user.value = newSession?.user ?? null
        })
    }

    async function login(email: string, password: string) {
        const auth = useAuth()
        const data = await auth.signInWithPassword(email, password)
        session.value = data.session
        user.value = data.user
    }

    async function loginWithGoogle() {
        const auth = useAuth()
        await auth.signInWithGoogle()
    }

    async function register(email: string, password: string) {
        const auth = useAuth()
        return await auth.signUp(email, password)
    }

    async function logout() {
        const auth = useAuth()
        await auth.signOut()
        session.value = null
        user.value = null
    }

    return { session, user, isAuthenticated, initialize, login, loginWithGoogle, register, logout }
})
