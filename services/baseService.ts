import { ofetch } from 'ofetch'

// Assume you’ve imported the utility functions above
import { toCamelCase, toSnakeCase } from '~/utils/caseUtils'

export function createBaseService<T>(baseUrl: string) {
    return {
        async fetchList(params?: Record<string, any>): Promise<T[]> {
            const response = await ofetch(baseUrl, { params })
            return toCamelCase(response)
        },

        async fetchOne(id: number | string, params?: Record<string, any>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, { params })
            return toCamelCase(response)
        },

        async create(data: Partial<T>): Promise<T> {
            const response = await ofetch(baseUrl, {
                method: 'POST',
                body: toSnakeCase(data)
            })
            return toCamelCase(response)
        },

        async update(id: number | string, data: Partial<T>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, {
                method: 'PUT',
                body: toSnakeCase(data)
            })
            return toCamelCase(response)
        },

        async patch(id: number | string, data: Partial<T>): Promise<T> {
            const response = await ofetch(`${baseUrl}${id}/`, {
                method: 'PATCH',
                body: toSnakeCase(data)
            })
            return toCamelCase(response)
        },

        async delete(id: number | string): Promise<void> {
            await ofetch(`${baseUrl}${id}/`, {
                method: 'DELETE'
            })
        }
    }
}
