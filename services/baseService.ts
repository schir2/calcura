export function createBaseService<T>(resource: string) {
    const { $api } = useNuxtApp(); // Use our global API wrapper

    const service = {
        async list(params?: Record<string, any>): Promise<T[]> {
            return toCamelCase(await $api(resource, { params }));
        },

        async get(id: number | string, params?: Record<string, any>): Promise<T> {
            return toCamelCase(await $api(`${resource}${id}/`, { params }));
        },

        async create(data: Partial<T>): Promise<T> {
            return toCamelCase(await $api(resource, {
                method: "POST",
                body: toSnakeCase(data),
            }));
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            return toCamelCase(await $api(`${resource}${id}/`, {
                method: "PUT",
                body: toSnakeCase(data),
            }));
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            return toCamelCase(await $api(`${resource}${id}/`, {
                method: "PATCH",
                body: toSnakeCase(data),
            }));
        },

        async delete(id: number | string): Promise<void> {
            await $api(`${resource}${id}/`, {
                method: "DELETE",
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
