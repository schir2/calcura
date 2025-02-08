import { toCamelCase, toSnakeCase } from "~/utils/caseUtils";
import type { $Fetch } from "nitropack";

export function createBaseService<T>(api: $Fetch, resource: string) {
    async function getHeaders() {
        const csrfToken = await getCsrfToken();
        return csrfToken
            ? { "X-CSRFToken": csrfToken }
            : {}; // If no token, return empty headers
    }

    const service = {
        async list(params?: Record<string, any>): Promise<T[]> {
            const headers = await getHeaders();
            const response = await api(resource, {
                credentials: "include",
                params,
                headers, // ✅ Send CSRF token
            });
            return toCamelCase(response);
        },

        async get(id: number | string, params?: Record<string, any>): Promise<T> {
            const headers = await getHeaders();
            const response = await api(`${resource}${id}/`, {
                credentials: "include",
                params,
                headers, // ✅ Send CSRF token
            });
            return toCamelCase(response);
        },

        async create(data: Partial<T>): Promise<T> {
            const headers = await getHeaders();
            const response = await api(resource, {
                credentials: "include",
                method: "POST",
                body: toSnakeCase(data),
                headers, // ✅ Send CSRF token
            });
            console.debug(`Created ${resource}`, response);
            return toCamelCase(response);
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            const headers = await getHeaders();
            const response = await api(`${resource}${id}/`, {
                credentials: "include",
                method: "PUT",
                body: toSnakeCase(data),
                headers, // ✅ Send CSRF token
            });
            console.debug(`Updated ${resource}`, response);
            return toCamelCase(response);
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            const headers = await getHeaders();
            const response = await api(`${resource}${id}/`, {
                credentials: "include",
                method: "PATCH",
                body: toSnakeCase(data),
                headers, // ✅ Send CSRF token
            });
            return toCamelCase(response);
        },

        async delete(id: number | string): Promise<void> {
            const headers = await getHeaders();
            await api(`${resource}${id}/`, {
                credentials: "include",
                method: "DELETE",
                headers, // ✅ Send CSRF token
            });
        },
    };

    return {
        ...service,
        extend<U>(methods: U): typeof service & U {
            return { ...service, ...methods };
        },
    };
}
