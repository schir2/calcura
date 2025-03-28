import type {Plan} from "~/types/Plan";

export function createBaseService<T>(resource: string) {
    const { $api } = useNuxtApp();

    const service = {
        async list(params?: Record<string, any>): Promise<T[]> {
            return await $api(resource, { params });
        },

        async get(id: number | string, params?: Record<string, any>): Promise<T> {
            return await $api(`${resource}${id}/`, { params });
        },

        async create(data: Partial<T>): Promise<T> {
            return await $api(resource, {
                method: "POST",
                body: data,
            });
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            return await $api(`${resource}${id}/`, {
                method: "PUT",
                body: data,
            });
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            return await $api(`${resource}${id}/`, {
                method: "PATCH",
                body: data,
            });
        },

        async delete(id: number | string): Promise<void> {
            await $api(`${resource}${id}/`, {
                method: "DELETE",
            });
        },

        async addRelatedModel(
            id: number,
            relatedModel: string,
            relatedId: number
        ): Promise<Plan> {
            return await $api(
                `${resource}/${id}/manage_related_model/`,
                {
                    method: 'POST',
                    body: {
                        related_model: relatedModel,
                        related_id: relatedId,
                        action: 'add',
                    }
                }
            )
        },
        async removeRelatedModel(
            id: number,
            relatedModel: string,
            relatedId: number
        ): Promise<Plan> {
            return await $api(
                `/api/${resource}/${id}/manage_related_model/`,
                {
                    method: 'POST',
                    body: {
                        related_model: relatedModel,
                        related_id: relatedId,
                        action: 'remove',
                    }
                }
            )
        },
    };

    return {
        ...service,
        extend<U>(methods: U): typeof service & U {
            return { ...service, ...methods };
        },
    };
}
