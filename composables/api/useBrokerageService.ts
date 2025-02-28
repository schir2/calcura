import type {Brokerage} from "~/types/Brokerage";

export function useBrokerageService() {
    return useApi<Brokerage>('brokerages')
}