import type {Credentials} from "~/types/Auth";

export const useAuth = () => {

    async function getCsrfToken(): Promise<string> {
        const data = await $fetch("/api/auth/csrf-token/", {
            credentials: "include",
        });
        return data.csrfToken;
    }

    async function login(credentials: Credentials) {
        const csrfToken = await getCsrfToken()
        return await $fetch('/api/auth/login/', {
            method: 'POST',
            body: credentials,
            credentials: 'include',
            headers: {'X-CSRFToken': csrfToken}
        })
    }

    async function logout() {

        const csrfToken = await getCsrfToken()
        return await $fetch("/api/auth/logout/", {
            method: "POST",
            credentials: 'include',
            headers: {'X-CSRFToken': csrfToken}
        });
    }


    async function register(credentials: Credentials) {
        const csrfToken = await getCsrfToken()
        return await $fetch("/api/auth/register/", {
            method: "POST",
            body: credentials,
            credentials: 'include',
            headers: {'X-CSRFToken': csrfToken}
        });
    }

    async function verify(key: string) {
        const csrfToken = await getCsrfToken()
        return await $fetch("/api/auth/verify/", {
            method: "POST",
            credentials: 'include',
            body: {key: key},
            headers: {'X-CSRFToken': csrfToken}
        })
    }

    async function emailExists(email: string): Promise<boolean> {
        const csrfToken = await getCsrfToken()
        const data =  await $fetch('/api/auth/email-exists/', {
            method: 'POST',
            body: {email: email},
            credentials: 'include',
            headers: {'X-CSRFToken': csrfToken}
        })
        return data.exists
    }


    return {login, logout, register, verify, emailExists};
};