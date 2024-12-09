import {createBaseService} from '~/services/baseService';
import type DebtConfig from "~/models/debt/DebtConfig";

export function useDebtService() {
    const config = useRuntimeConfig();
    return createBaseService<DebtConfig>(config.public.apiBaseUrl, 'debt-configs/');
}
