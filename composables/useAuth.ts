import type {User} from "~/types/User";
import type {Credentials} from "~/types/Auth";

export const useAuth = () => {
    const user = useState<User | null>("user", () => null);

    async function getCsrfToken() {
        const data = await $fetch("/api/auth/csrf/", {
            credentials: "include",
        });
        return data.csrfToken;
    }

    const fetchUser = async () => {
        if (user.value) return;
        try {
            user.value =  await $fetch("/api/users/me/");
        } catch (error) {
            console.error("Failed to fetch user", error);
            user.value = null;
        }
        console.log(user.value);
    };

    async function login(credentials: Credentials) {
        const csrfToken = await getCsrfToken()
        await $fetch('/api/auth/login/', {
            method: 'POST',
            body: credentials,
            credentials: 'include',
            headers: {'X-CSRFToken': csrfToken}
        })
        await fetchUser();
    }

    async function logout() {
        try {

            const csrfToken = await getCsrfToken()
            const data = await $fetch("/api/auth/logout/", {
                method: "POST",
                credentials: 'include',
                headers: {'X-CSRFToken': csrfToken}
            });
            user.value = null;
        } catch (error) {
            console.log(error)
        }
    }



    return { user, fetchUser, login, logout };
};
