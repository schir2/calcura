import type {Credentials} from "~/types/Auth";

export const useAuth = () => {

    async function getCsrfToken() {
        const data = await $fetch("/api/auth/csrf/", {
            credentials: "include",
        });
        return data.csrfToken;
    }

    async function login(credentials: Credentials) {
        const csrfToken = await getCsrfToken()
        try {
            await $fetch('/api/auth/login/', {
                method: 'POST',
                body: credentials,
                credentials: 'include',
                headers: {'X-CSRFToken': csrfToken}
            })
        } catch (error) {
            `Failed to perform useAuth.login() ${error}`
        }
    }

    async function logout() {
        try {

            const csrfToken = await getCsrfToken()
            const data = await $fetch("/api/auth/logout/", {
                method: "POST",
                credentials: 'include',
                headers: {'X-CSRFToken': csrfToken}
            });
        } catch (error) {
            console.log(`Failed to perform useAuth.logout() ${error}`)
        }
    }


    return {login, logout};
};