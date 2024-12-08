import {createBaseService} from '~/services/baseService';

export function useExpenseService<ExpenseConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'expense-configs/');
}
