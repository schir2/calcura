import type {Database} from '#shared/types/database.types'

export function usePlanService() {
    const client = useSupabaseClient<Database>()

    return {
        ...useApi('plan'),

        addIncome: async (planId: number, incomeId: number) => {
            const {error} = await client.from('plan_incomes').insert({plan_id: planId, income_id: incomeId})
            if (error) throw error
        },
        removeIncome: async (planId: number, incomeId: number) => {
            const {error} = await client.from('plan_incomes').delete().eq('plan_id', planId).eq('income_id', incomeId)
            if (error) throw error
        },

        addExpense: async (planId: number, expenseId: number) => {
            const {error} = await client.from('plan_expenses').insert({plan_id: planId, expense_id: expenseId})
            if (error) throw error
        },
        removeExpense: async (planId: number, expenseId: number) => {
            const {error} = await client.from('plan_expenses').delete().eq('plan_id', planId).eq('expense_id', expenseId)
            if (error) throw error
        },

        addDebt: async (planId: number, debtId: number) => {
            const {error} = await client.from('plan_debts').insert({plan_id: planId, debt_id: debtId})
            if (error) throw error
        },
        removeDebt: async (planId: number, debtId: number) => {
            const {error} = await client.from('plan_debts').delete().eq('plan_id', planId).eq('debt_id', debtId)
            if (error) throw error
        },

        addCashReserve: async (planId: number, cashReserveId: number) => {
            const {error} = await client.from('plan_cash_reserves').insert({
                plan_id: planId,
                cash_reserve_id: cashReserveId
            })
            if (error) throw error
        },
        removeCashReserve: async (planId: number, cashReserveId: number) => {
            const {error} = await client.from('plan_cash_reserves').delete().eq('plan_id', planId).eq('cash_reserve_id', cashReserveId)
            if (error) throw error
        },

        addBrokerage: async (planId: number, brokerageId: number) => {
            const {error} = await client.from('plan_brokerages').insert({plan_id: planId, brokerage_id: brokerageId})
            if (error) throw error
        },
        removeBrokerage: async (planId: number, brokerageId: number) => {
            const {error} = await client.from('plan_brokerages').delete().eq('plan_id', planId).eq('brokerage_id', brokerageId)
            if (error) throw error
        },

        addIra: async (planId: number, iraId: number, incomeId?: number) => {
            const {error} = await client.from('plan_iras').insert({
                plan_id: planId,
                ira_id: iraId,
                income_id: incomeId ?? null
            })
            if (error) throw error
        },
        removeIra: async (planId: number, iraId: number) => {
            const {error} = await client.from('plan_iras').delete().eq('plan_id', planId).eq('ira_id', iraId)
            if (error) throw error
        },
        setIraIncome: async (planId: number, iraId: number, incomeId: number | null) => {
            const {error} = await client.from('plan_iras').update({income_id: incomeId}).eq('plan_id', planId).eq('ira_id', iraId)
            if (error) throw error
        },

        addRothIra: async (planId: number, rothIraId: number, incomeId?: number) => {
            const {error} = await client.from('plan_roth_iras').insert({
                plan_id: planId,
                roth_ira_id: rothIraId,
                income_id: incomeId ?? null
            })
            if (error) throw error
        },
        removeRothIra: async (planId: number, rothIraId: number) => {
            const {error} = await client.from('plan_roth_iras').delete().eq('plan_id', planId).eq('roth_ira_id', rothIraId)
            if (error) throw error
        },
        setRothIraIncome: async (planId: number, rothIraId: number, incomeId: number | null) => {
            const {error} = await client.from('plan_roth_iras').update({income_id: incomeId}).eq('plan_id', planId).eq('roth_ira_id', rothIraId)
            if (error) throw error
        },

        addHsa: async (planId: number, hsaId: number) => {
            const {error} = await client.from('plan_hsas').insert({plan_id: planId, hsa_id: hsaId})
            if (error) throw error
        },
        removeHsa: async (planId: number, hsaId: number) => {
            const {error} = await client.from('plan_hsas').delete().eq('plan_id', planId).eq('hsa_id', hsaId)
            if (error) throw error
        },

        addTaxDeferred: async (planId: number, taxDeferredId: number, incomeId?: number) => {
            const {error} = await client.from('plan_tax_deferreds').insert({
                plan_id: planId,
                tax_deferred_id: taxDeferredId,
                income_id: incomeId ?? null
            })
            if (error) throw error
        },
        removeTaxDeferred: async (planId: number, taxDeferredId: number) => {
            const {error} = await client.from('plan_tax_deferreds').delete().eq('plan_id', planId).eq('tax_deferred_id', taxDeferredId)
            if (error) throw error
        },
        setTaxDeferredIncome: async (planId: number, taxDeferredId: number, incomeId: number | null) => {
            const {error} = await client.from('plan_tax_deferreds').update({income_id: incomeId}).eq('plan_id', planId).eq('tax_deferred_id', taxDeferredId)
            if (error) throw error
        },
    }
}