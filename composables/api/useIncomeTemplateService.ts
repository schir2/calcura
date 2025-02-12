import {createBaseService} from '~/services/baseService';
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";

export function useIncomeTemplateService() {
    return useApi<IncomeTemplate>('income-templates')
}