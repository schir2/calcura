import type {Database} from "#shared/types/database.types.js";

type Tables = Database['public']['Tables']

type TablesWithId = {
    [K in keyof Tables as Tables[K]['Row'] extends { id: number }
        ? K
        : never]: Tables[K]
}

export function modelStoreFactory<T extends keyof TablesWithId>(modelName: T) {
    type TRow = TablesWithId[T]['Row']
    type TUpdate = TablesWithId[T]['Update']
    type TInsert = TablesWithId[T]['Insert']

    return defineStore(modelName, () => {

        const supabase = useSupabaseClient<Database>()
        const list = computed(() => Object.values(map.value))
        const map = ref<Record<number, TRow>>({})
        const loaded = ref<boolean>(false)

        function reset() {
            map.value = {}
        }

        function setAll(rows: TRow[]) {
            reset()
            map.value = Object.fromEntries(rows.map(row => [row.id, row]))
        }

        function get(id: number): TRow | undefined {
            return map.value[id]
        }

        function set(id: number, value: TRow) {
            map.value[id] = value
        }

        function remove(id: number) {
            delete map.value[id]
        }

        async function fetch(id: number): Promise<TRow> {
            const {data, error} = await supabase
                .from(modelName as ModelName)
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            set(id, data as TRow)
            return data
        }

        async function fetchAll(): Promise<TRow[]> {
            const {data, error} = await supabase
                .from(modelName as ModelName)
                .select()
            if (error) throw error
            setAll(data)
            return data
        }

        async function fetchByColumn(column: keyof TRow, value: TRow[keyof TRow]): Promise<TRow[]> {
            const {data, error} = await supabase
                .from(modelName as ModelName)
                .select('*')
                .eq(column, value)
            if (error) throw error
            setAll(data)
            return data

        }

        async function patch(id: number, update: TUpdate): Promise<TRow> {
            const {data, error} = await supabase
                .from(modelName as ModelName)
                .update(update).eq('id', id)
                .select()
                .single()
            if (error) throw error
            set(id, data)
            return data
        }

        async function create(payload: TInsert): Promise<TRow> {
            const {data, error} = await supabase.from(modelName as ModelName).insert(payload).select().single()
            if (error) throw error
            set(data.id, data)
            return data
        }

        async function purge(id: number) {
            const data = get(id)
            const {error} = await supabase.from(modelName as ModelName).delete().eq('id', id)
            if (error) throw error
            remove(id)
            return data
        }

        return {
            list, map, loaded,
            get, set, remove, reset,
            fetch, fetchAll, fetchByColumn, patch, create, purge
        }
    })
}