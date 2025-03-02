export function useApi<T>(tableName: string) {
    const supabase = useSupabaseClient()

    const get = async (id: number | string) => {
        const { data, error } = await supabase
            .from<T>(tableName)
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    }

    const list = async (params?: Record<string, any>) => {
        // Apply params if you want to filter or limit, e.g. .eq("status", params?.status)
        const { data, error } = await supabase
            .from<T>(tableName)
            .select('*')
        if (error) throw error
        return data
    }

    const create = async (data: Partial<T>) => {
        const { data: newData, error } = await supabase
            .from<T>(tableName)
            .insert(data)
            .single()
        if (error) throw error
        return newData
    }

    const update = async (id: number | string, data: Partial<T>) => {
        const { data: updated, error } = await supabase
            .from<T>(tableName)
            .update(data)
            .eq('id', id)
            .single()
        if (error) throw error
        return updated
    }

    // With Supabase, `patch` is effectively the same as `update`
    const patch = update

    const remove = async (id: number | string) => {
        const { error } = await supabase
            .from<T>(tableName)
            .delete()
            .eq('id', id)
        if (error) throw error
    }

    return { get, list, create, update, patch, remove }
}
