import type {Plan} from "~/types/Plan";

export function usePlanService() {
    return useApi<Plan>('plans')
}
