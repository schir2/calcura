import type {Credentials} from "~/types/Auth";

export function useAuth() {
    const user = useState("user", () => null);
    const { $api } = useNuxtApp();

    async function login(credentials: Credentials) {
        console.log("🟡 Sending login request...");

        try {
            const { data, error } = await $api("auth/login/", {
                method: "POST",
                body: credentials,
            });

            console.log("✅ Login response received in Nuxt:", { data, error });

            if (error && error.value) {
                console.error("❌ Login API error:", error.value);
            }

            return { data, error };
        } catch (err) {
            console.error("❌ Unexpected login error in Nuxt:", err);
            return { data: null, error: { value: err } };
        }
    }


    async function logout() {
        const { error } = await $api("auth/logout/", {
            method: "POST",
        });

        if (!error.value) {
            user.value = null;
        }

        return { error };
    }

    return { user, login, logout };
}
