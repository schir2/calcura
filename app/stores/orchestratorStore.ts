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
    const brokerageStore = useBrokerageStore()
    const hsaStore = useHsaStore()
    const commandSequenceStore = useCommandSequenceStore()

    async function load(id: number) {
        const [fetchedPlan] = await Promise.all([
            planStore.fetch(id),
            expenseStore.fetchByColumn('plan_id', id),
            cashReserveStore.fetchByColumn('plan_id', id),
            debtStore.fetchByColumn('plan_id', id),
            incomeStore.fetchByColumn('plan_id', id),
            taxDeferredStore.fetchByColumn('plan_id', id),
            rothIraStore.fetchByColumn('plan_id', id),
            iraStore.fetchByColumn('plan_id', id),
            brokerageStore.fetchByColumn('plan_id', id),
            hsaStore.fetchByColumn('plan_id', id),
            commandSequenceStore.fetchByPlan(id),
        ])
        plan.value = fetchedPlan
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
            hsas: hsaStore.list,
            iras: iraStore.list,
            roth_iras: rothIraStore.list,
            command_sequences: commandSequenceStore.list,
        }
    })

    async function reloadPlan(id: number) {
        plan.value = await planStore.fetch(id)
    }

    function simulate(commandSequence: CommandSequenceWithRelations) {
        if (!planWithRelations.value) return
        const planManager = new PlanManager(planWithRelations.value)
        return planManager.simulate(commandSequence)

    }

    return {
        load,
        reloadPlan,
        plan,
        planId,
        loaded,
        planWithRelations,
        simulate,
    }

})