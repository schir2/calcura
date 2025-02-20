import type {Plan} from "~/models/plan/Plan";

export function usePlanService() {
    return useApi<Plan>('plans')
}
