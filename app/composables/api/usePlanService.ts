import type {Database} from '#shared/types/database.types'

export function usePlanService() {
    const client = useSupabaseClient<Database>()

    return {
        ...useApi('plan'),
    }
}