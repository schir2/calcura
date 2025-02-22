import {createBaseService} from '~/services/baseService';
import type {DebtTemplate} from "~/models/debt/Debt";

export function useDebtTemplateService() {
    return useApi<DebtTemplate>('debt-templates')
}