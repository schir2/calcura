import PlanManager from "~/models/plan/PlanManager";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {ModelName} from "#shared/types/ModelName";
import type {BaseState} from "#shared/types/BaseState";
import type {OrchestratorState} from "#shared/types/OrchestratorState";
import type BaseManager from "~/models/common/BaseManager";
import type {Income} from "#shared/types/Income";

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

// ira/roth/tax_deferred managers resolve their funding income via the nested `config.income`
// object (see each manager's `incomeManager` getter), but the store rows carry only `income_id`.
// Attach the income here so `percentage_of_income` contributions actually scale off the income.
const INCOME_LINKED_KEYS = new Set(['tax_deferreds', 'iras', 'roth_iras'])

function attachIncome<T extends {income_id?: number | null}>(rows: T[], incomes: Income[]): (T & {income?: Income})[] {
    return rows.map(row => ({
        ...row,
        income: row.income_id != null ? incomes.find(income => income.id === row.income_id) : undefined,
    }))
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
    const lastPreviewRetirementIndex = ref<number | null>(null)
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
            tax_deferreds: attachIncome(taxDeferredStore.list, incomeStore.list),
            brokerages: brokerageStore.list,
            hsas: hsaStore.list,
            iras: attachIncome(iraStore.list, incomeStore.list),
            roth_iras: attachIncome(rothIraStore.list, incomeStore.list),
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
        const overriddenList = exists
            ? current.map(item => (item.id === entity.id ? {...item, ...entity} : item))
            : [...current, entity]
        const overridden = {
            ...planWithRelations.value,
            [key]: INCOME_LINKED_KEYS.has(key)
                ? attachIncome(overriddenList as {income_id?: number | null}[], incomeStore.list)
                : overriddenList,
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
        const planStates = planManager.simulate(sequence)
        const retiredIndex = planStates.findIndex(state => state.retired)
        lastPreviewRetirementIndex.value = retiredIndex === -1 ? null : retiredIndex
        return snapshotManagerStates(planManager)[modelName]?.[entity.id] ?? null
    }

    // Baseline for the Workspace comparison (#107): the saved plan's projection for this entity,
    // captured when the drawer opens (snapshot-on-open). Runs the unedited plan — no override.
    function entityBaseline(
        modelName: ModelName,
        id: number,
        commandSequence: CommandSequenceWithRelations
    ): BaseState[] | null {
        const result = simulate(commandSequence)
        return result?.managerStates[modelName]?.[id] ?? null
    }

    // Plan Workspace preview (ADR 015). Simpler than the entity case: no entity is added or
    // changed, so there is no synthetic command to inject — just run the plan's own config
    // overridden by the in-flight edits. Returns the whole trajectory, since the plan has no
    // balance of its own; its projection IS the verdict + the spine.
    function simulatePlanPreview(
        planConfig: Partial<Plan>,
        commandSequence: CommandSequenceWithRelations
    ): OrchestratorState[] | null {
        if (!planWithRelations.value) return null
        const planManager = new PlanManager({...planWithRelations.value, ...planConfig})
        const states = planManager.simulate(commandSequence)
        const retiredIndex = states.findIndex(state => state.retired)
        lastPreviewRetirementIndex.value = retiredIndex === -1 ? null : retiredIndex
        return states
    }

    // Snapshot-on-open baseline for the Plan Workspace: the saved plan's trajectory, unedited.
    function planBaseline(commandSequence: CommandSequenceWithRelations): OrchestratorState[] | null {
        return simulate(commandSequence)?.states ?? null
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
        entityBaseline,
        simulatePlanPreview,
        planBaseline,
        lastPreviewRetirementIndex,
    }

})