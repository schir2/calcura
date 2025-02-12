import type {User} from "~/types/User";
import type {Credentials} from "~/types/Auth";

const auth = useAuth()

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const csrfToken = ref<string>('')
    const isAuthenticated = computed((): boolean => {
        return !!user.value;

    })

    async function login(credentials: Credentials): Promise<void> {
        try {
            await auth.login(credentials)
            await fetchUser()
        } catch (error) {
            console.error("Login failed:", error);
            throw error
        }
    }

    async function logout(): Promise<void> {
        try {
            await auth.logout();
            user.value = null;
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    async function fetchUser() {
        try {
            user.value = await $fetch("/api/users/me/");
        } catch (error) {
            console.error("Failed to fetch user", error);
        }
    }

    return {user, login, logout, isAuthenticated, csrfToken, fetchUser};
})