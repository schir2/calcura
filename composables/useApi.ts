import type {Database} from '~/types/database.types'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

export function useApi<
    T extends TableName = TableName,
    Row = Tables[T]['Row'],
    Insert = Tables[T]['Insert'],
    Update = Tables[T]['Update']

>(table: T,) {
    const client = useSupabaseClient<Database>()


    return {
        async list(): Promise<Row[]> {
            const {data, error} = await client.from(table).select('*')
            if (error) throw error
            return data as Row[]
        },

        async get(id: number): Promise<Row> {
            const {data, error} = await client.from(table).select('*').eq('id', id).single()
            if (error) throw error
            return data as Row
        },

        async create(payload: Insert): Promise<Row> {
            const {data, error} = await client.from(table).insert(payload as any).select().single()
            if (error) throw error
            return data as Row
        },

        async update(id: number, payload: Update): Promise<Row> {
            const {data, error} = await client.from(table).update(payload as any).eq('id', id).select().single()
            if (error) throw error
            return data as Row
        },

        async remove(id: number): Promise<void> {
            const {error} = await client.from(table).delete().eq('id', id)
            if (error) throw error
        },
    }
}
