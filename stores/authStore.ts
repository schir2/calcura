import type {User} from "~/types/User";
import type {Credentials} from "~/types/Auth";

const auth = useAuth()

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const csrfToken = ref<string>('')
    const isAuthenticated = computed((): boolean => {
        return !!user.value;

    })

    async function login(credentials: Credentials) {
        try {
            const response = await auth.login(credentials)
            await fetchUser()
            return response
        } catch (error) {
            console.debug("Login failed:", error);
            throw error
        }
    }

    async function register(credentials: Credentials) {
        try {
            return await auth.register(credentials)
        } catch (error) {
            console.debug("Registration failed:", error);
            throw error
        }
    }

    async function logout() {
        try {
            const response = await auth.logout();
            user.value = null;
            return response
        } catch (error) {
            console.debug("Logout failed:", error);
        }
    }

    async function fetchUser() {
        try {
            user.value = await $fetch("/api/users/me/");
        } catch (error) {
            console.debug("Failed to fetch user", error);
        }
    }

    async function verify(key: string){
        try {
            const response = await auth.verify(key)
            await fetchUser()
            return response
        } catch (error) {
            console.debug("Verification failed:", error);
            throw error
        }
    }

    return {user, login, logout, register, verify, isAuthenticated, csrfToken, fetchUser};
})