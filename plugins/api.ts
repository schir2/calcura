export default defineNuxtPlugin((nuxtApp) => {
    let csrfToken: string | null = null;


    const fetchCsrfToken = async () => {
        if (csrfToken) return csrfToken;
        try {
            const data = await $fetch("/api/auth/csrf/", {credentials: "include"});
            csrfToken = data.csrfToken;
            return csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token", error);
            return "";
        }
    };


    const customFetch = async (url: string, options: any = {}) => {
        if (!options.credentials) {
            options.credentials = "include";
        }

        if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method)) {
            options.headers = {
                ...(options.headers || {}),
                "X-CSRFToken": await fetchCsrfToken(),
            };
        }

        return await $fetch(url, options);
    };


    nuxtApp.provide("api", customFetch);
});
