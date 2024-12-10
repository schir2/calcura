import { toCamelCase, toSnakeCase } from '~/utils/caseUtils';
import type {$Fetch} from "nitropack";

export function createBaseService<T>(api: $Fetch, resource: string) {

    const service = {
        async list(params?: Record<string, any>): Promise<T[]> {
            const response = await api(resource, { params });
            return toCamelCase(response);
        },

        async get(id: number | string, params?: Record<string, any>): Promise<T> {
            const response = await api(`${resource}${id}/`, { params });
            return toCamelCase(response);
        },

        async create(data: Partial<T>): Promise<T> {
            const response = await api(resource, {
                method: 'POST',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            const response = await api(`${resource}${id}/`, {
                method: 'PUT',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            const response = await api(`${resource}${id}/`, {
                method: 'PATCH',
                body: toSnakeCase(data),
            });
            return toCamelCase(response);
        },

        async delete(id: number | string): Promise<void> {
            await api(`${resource}${id}/`, {
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
