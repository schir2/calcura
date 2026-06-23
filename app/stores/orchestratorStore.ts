import PlanManager from "~/models/plan/PlanManager";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";

export const orchestratorStore = defineStore('orchestrator', () => {
    const planId = ref<number | null>(null)
    const plan = ref<Plan | null>(null)
    const loaded = ref(false)
    const planStore = usePlanStore()
    const expenseStore = useExpenseStore()
    const cashReserveStore = useCashReserveStore()
    const debtStore = useDebtStore()
    const incomeStore = useIncomeStore()
    const taxDeferredStore = useTaxDeferredStore()
    const rothIraStore = useRothIraStore()
    const iraStore = useIraStore()
    const brokerageStore = useHsaStore()
    const commandSequenceStore = useCommandSequenceStore()

    async function load(id: number) {
        await Promise.all([
            planStore.fetch(id),
            expenseStore.fetchByColumn('plan_id', planId.value),
            cashReserveStore.fetchByColumn('plan_id', planId.value),
            debtStore.fetchByColumn('plan_id', planId.value),
            incomeStore.fetchByColumn('plan_id', planId.value),
            taxDeferredStore.fetchByColumn('plan_id', planId.value),
            rothIraStore.fetchByColumn('plan_id', planId.value),
            iraStore.fetchByColumn('plan_id', planId.value),
            brokerageStore.fetchByColumn('plan_id', planId.value),
            commandSequenceStore.fetchByPlan(id),
        ])
        loaded.value = true
    }

    watch(planId, async (newPlanId) => {
        loaded.value = false
        if (!newPlanId) return
        await load(newPlanId)
        loaded.value = true
    })

    const planWithRelations = computed(() => {
        if (!loaded.value || !plan.value) return null
        return {
            ...plan.value,
            cash_reserves: cashReserveStore.list,
            incomes: incomeStore.list,
            expenses: expenseStore.list,
            debts: debtStore.list,
            tax_deferreds: taxDeferredStore.list,
            brokerages: brokerageStore.list,
            iras: iraStore.list,
            roth_iras: rothIraStore.list,
            command_sequences: commandSequenceStore.list

        }
    })

    function simulate(commandSequence: CommandSequenceWithRelations) {
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