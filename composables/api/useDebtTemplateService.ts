import {createBaseService} from '~/services/baseService';
import type {DebtTemplate} from "~/types/Debt";

export function useDebtTemplateService() {
    return useApi<DebtTemplate>('debt-templates')
}