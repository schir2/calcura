import type {Database, Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'
import type {TableName} from "#shared/types/TableName";

export function useApi<T extends TableName>(table: T) {
    const client = useSupabaseClient<Database>()

    return {
        async list(): Promise<Tables<T>[]> {
            const {data, error} = await client.from(table).select('*')
            if (error) throw error
            return data as Tables<T>[]
        },

        async get(id: number): Promise<Tables<T>> {
            const {data, error} = await client.from(table).select('*').eq('id', id).single()
            if (error) throw error
            return data as Tables<T>
        },

        async create(payload: TablesInsert<T>): Promise<Tables<T>> {
            const {data, error} = await client.from(table).insert(payload as any)
            if (error) throw error
            return data as Tables<T>
        },

        async update(id: number, payload: TablesUpdate<T>): Promise<Tables<T>> {
            const {data, error} = await client.from(table).update(payload as any).eq('id', id).select().single()
            if (error) throw error
            return data as Tables<T>
        },

        async remove(id: number): Promise<void> {
            const {error} = await client.from(table).delete().eq('id', id)
            if (error) throw error
        },
    }
}
