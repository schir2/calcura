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

    const mode = computed<'create' | 'edit'>(() =>
        kind.value === 'plan' || id.value !== null ? 'edit' : 'create')

    function open(model: ModelName, entityId: number) {
        kind.value = 'entity'
        modelName.value = model
        id.value = entityId
        planId.value = null
        isOpen.value = true
    }

    function openCreate(model: ModelName, forPlanId: number) {
        kind.value = 'entity'
        modelName.value = model
        id.value = null
        planId.value = forPlanId
        isOpen.value = true
    }

    function openPlan(forPlanId: number, tab: PlanWorkspaceTab = 'rates') {
        kind.value = 'plan'
        modelName.value = null
        id.value = forPlanId
        planId.value = forPlanId
        planTab.value = tab
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
        kind.value = null
        modelName.value = null
        id.value = null
        planId.value = null
        planTab.value = 'rates'
    }

    return {isOpen, kind, modelName, id, planId, planTab, mode, open, openCreate, openPlan, close}
})