import {modelStoreFactory} from "~/stores/base/modelStoreFactory";
import PlanManager from "~/models/plan/PlanManager";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";

export const orchestratorStore = defineStore('orchestrator', () => {
    const planId = ref<number | null>(null)
    const plan = ref<Plan | null>(null)
    const loaded = ref(false)
    const planStore = modelStoreFactory('plan')()
    const expenseStore = modelStoreFactory('expense')()
    const cashReserveStore = modelStoreFactory('cash_reserve')()
    const debtStore = modelStoreFactory('debt')()
    const incomeStore = modelStoreFactory('income')()
    const taxDeferredStore = modelStoreFactory('tax_deferred')()
    const rothIraStore = modelStoreFactory('roth_ira')()
    const iraStore = modelStoreFactory('ira')()
    const brokerageStore = modelStoreFactory('brokerage')()

    async function load(id: number) {
        planId.value = id
        await Promise.all([
            planStore.fetch(id),
            expenseStore.fetchByColumn('plan_id', planId),
            cashReserveStore.fetchByColumn('plan_id', planId),
            debtStore.fetchByColumn('plan_id', planId),
            incomeStore.fetchByColumn('plan_id', planId),
            taxDeferredStore.fetchByColumn('plan_id', planId),
            rothIraStore.fetchByColumn('plan_id', planId),
            iraStore.fetchByColumn('plan_id', planId),
            brokerageStore.fetchByColumn('plan_id', planId)
        ])
        loaded.value = true

    }

    const planWithRelations = computed<PlanWithRelations | null>(() => {
        if (!loaded.value) return null
        return {
            ...plan,
            cash_reserves: cashReserveStore.list(),
            incomes: incomeStore.list(),
            expenses: expenseStore.list(),
            debts: debtStore.list(),
            tax_deferreds: taxDeferredStore.list(),
            brokerages: brokerageStore.list(),
            iras: iraStore.list(),
            roth_iras: rothIraStore.list(),
            command_sequences: []

        }
    })

    function simulate(commandSequence: CommandSequenceWithRelations[]) {
        if (!planWithRelations.value) return
        const planManager = new PlanManager(planWithRelations.value)
        return planManager.simulate(commandSequence)

    }

    return {
        load,
        plan,
        planWithRelations,
    }

})