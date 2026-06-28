import type {Database} from '#shared/types/database.types'

export const useProfileService = () => {
    const client = useSupabaseClient<Database>()

    async function get(userId: string) {
        const {data, error} = await client
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()
        if (error) throw error
        return data
    }

    return {get}
}