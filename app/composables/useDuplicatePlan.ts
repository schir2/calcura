import type {Database} from '#shared/types/database.types'

// A plan is a scenario, and scenarios are made by cloning and tweaking (ADR 015). The copy runs
// as one Postgres transaction (`duplicate_plan`) rather than a chain of client round trips: it has
// to re-point every income_id at the copied income, and a half-finished clone would silently
// couple the new scenario to the old one.
export function useDuplicatePlan() {
    const supabase = useSupabaseClient<Database>()

    async function duplicatePlan(planId: number): Promise<number> {
        const {data, error} = await supabase.rpc('duplicate_plan', {p_plan_id: planId})
        if (error) throw error
        return data
    }

    return {duplicatePlan}
}
