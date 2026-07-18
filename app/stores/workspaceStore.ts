import type {ModelName} from '#shared/types/ModelName'

// The plan is a Workspace target but NOT an entity (ADR 015): `model_name` is the command
// table's enum, so 'plan' must never enter it. `kind` discriminates instead.
export type WorkspaceKind = 'entity' | 'plan'
export type PlanWorkspaceTab = 'rates' | 'goal' | 'timeline'

export const useWorkspaceStore = defineStore('workspace', () => {
    const isOpen = ref(false)
    const kind = ref<WorkspaceKind | null>(null)
    const modelName = ref<ModelName | null>(null)
    const id = ref<number | null>(null)
    const planId = ref<number | null>(null)
    const planTab = ref<PlanWorkspaceTab>('rates')
    const seed = ref<Record<string, unknown> | null>(null)
    const dirty = ref(false)

    const mode = computed<'create' | 'edit'>(() =>
        kind.value === 'plan' || id.value !== null ? 'edit' : 'create')

    function open(model: ModelName, entityId: number) {
        kind.value = 'entity'
        modelName.value = model
        id.value = entityId
        planId.value = null
        seed.value = null
        dirty.value = false
        isOpen.value = true
    }

    function openCreate(model: ModelName, forPlanId: number, seedValues: Record<string, unknown> | null = null) {
        kind.value = 'entity'
        modelName.value = model
        id.value = null
        planId.value = forPlanId
        seed.value = seedValues
        dirty.value = false
        isOpen.value = true
    }

    function openPlan(forPlanId: number, tab: PlanWorkspaceTab = 'rates') {
        kind.value = 'plan'
        modelName.value = null
        id.value = forPlanId
        planId.value = forPlanId
        planTab.value = tab
        seed.value = null
        dirty.value = false
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
        kind.value = null
        modelName.value = null
        id.value = null
        planId.value = null
        planTab.value = 'rates'
        seed.value = null
        dirty.value = false
    }

    return {isOpen, kind, modelName, id, planId, planTab, seed, dirty, mode, open, openCreate, openPlan, close}
})