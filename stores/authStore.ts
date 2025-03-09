import type {User} from "~/types/User";
import type {Credentials} from "~/types/Auth";
import type {UserProfile} from "~/types/UserProfile";

const auth = useAuth()

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const profile = ref<UserProfile | null>(null)
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
            const fetchedUser = await $fetch<User>("/api/users/me/");
            profile.value = fetchedUser.profile
            delete fetchedUser.profile
            user.value = fetchedUser

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

    return {user, profile, login, logout, register, verify, isAuthenticated, fetchUser};
},)