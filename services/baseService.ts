import { ofetch } from 'ofetch';
import { toCamelCase, toSnakeCase } from '~/utils/caseUtils';

export function createBaseService<T>(apiBaseUrl: string, resource: string) {
    const baseUrl = `${apiBaseUrl}${resource}`;

    const service = {
        async list(params?: Record<string, any>): Promise<T[]> {
            const response = await ofetch(baseUrl, { params });
            return toCamelCase(response);
        },

        async get(id: number | string, params?: Record<string, any>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, { params });
            return toCamelCase(response);
        },

        async create(data: Partial<T>): Promise<T> {
            const response = await ofetch(baseUrl, {
                method: 'POST',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, {
                method: 'PUT',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, {
                method: 'PATCH',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async delete(id: number | string): Promise<void> {
            await ofetch(`${baseUrl}${id}/`, {
                method: 'DELETE',
            });
        },
    };

    return {
        ...service,
        extend(methods: Record<string, (...args: any[]) => any>) {
            return { ...service, ...methods };
        },
    };
}
