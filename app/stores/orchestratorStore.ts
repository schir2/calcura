import PlanManager from "~/models/plan/PlanManager";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {ModelName} from "#shared/types/ModelName";
import type {BaseState} from "#shared/types/BaseState";
import type BaseManager from "~/models/common/BaseManager";

// Sentinel id for a not-yet-persisted entity being previewed in create mode. Negative so it
// never collides with a real BIGINT-identity id; used by WorkspaceForms for the live projection.
export const PREVIEW_TEMP_ID = -1

const RELATION_KEY: Record<ModelName, string> = {
    income: 'incomes',
    expense: 'expenses',
    debt: 'debts',
    cash_reserve: 'cash_reserves',
    tax_deferred: 'tax_deferreds',
    brokerage: 'brokerages',
    ira: 'iras',
    roth_ira: 'roth_iras',
    hsa: 'hsas',
}

function snapshotManagerStates(planManager: PlanManager): ManagerStates {
    const result: ManagerStates = {}
    for (const [modelName, managers] of Object.entries(planManager.managers) as [ModelName, BaseManager<any, any>[]][]) {
        const byId: Record<number, BaseState[]> = {}
        for (const manager of managers) {
            byId[manager.getConfig().id] = manager.getStates()
        }
        result[modelName] = byId
    }
    return result
}

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
        const states = planManager.simulate(commandSequence)
        return {states, managerStates: snapshotManagerStates(planManager)}
    }

    function simulateEntityPreview(
        modelName: ModelName,
        entity: {id: number} & Record<string, unknown>,
        commandSequence: CommandSequenceWithRelations
    ): BaseState[] | null {
        if (!planWithRelations.value) return null
        const key = RELATION_KEY[modelName]
        const current = planWithRelations.value[key as keyof typeof planWithRelations.value] as {id: number}[]
        const exists = current.some(item => item.id === entity.id)
        const overridden = {
            ...planWithRelations.value,
            [key]: exists
                ? current.map(item => (item.id === entity.id ? {...item, ...entity} : item))
                : [...current, entity],
        }

        // Create-mode preview: the new entity has no command yet (the DB trigger adds one only
        // on real insert), so the simulation would never process it. Inject a synthetic active
        // 'process' command mirroring the trigger, so the projection reflects contributions.
        let sequence = commandSequence
        if (!exists) {
            const maxOrder = commandSequence.command_sequence_commands
                .reduce((max, csc) => Math.max(max, csc.order), 0)
            const syntheticCommand = {
                id: -1,
                sequence_id: commandSequence.id,
                command_id: -1,
                is_active: true,
                order: maxOrder + 1,
                command: {
                    id: -1,
                    model_name: modelName,
                    model_id: entity.id,
                    action: 'process',
                    is_active: true,
                    created_at: '',
                    edited_at: '',
                    creator_id: null,
                    editor_id: null,
                },
            } as CommandSequenceCommandWithRelations
            sequence = {
                ...commandSequence,
                command_sequence_commands: [...commandSequence.command_sequence_commands, syntheticCommand],
            }
        }

        const planManager = new PlanManager(overridden)
        planManager.simulate(sequence)
        return snapshotManagerStates(planManager)[modelName]?.[entity.id] ?? null
    }

    return {
        load,
        reloadPlan,
        plan,
        planId,
        loaded,
        planWithRelations,
        simulate,
        simulateEntityPreview,
    }

})