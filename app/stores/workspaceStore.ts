import type {ModelName} from '#shared/types/ModelName'

// Domains whose Entity Workspace form is built. Their create + edit use the slide-out
// drawer instead of the legacy create modal / inline edit modal. Add a model here when
// its <domain>/WorkspaceForm.vue lands (see docs/design/entity-workspace-implementation.md).
export const WORKSPACE_ENABLED_MODELS: ModelName[] = [
    'brokerage', 'hsa', 'debt', 'expense', 'tax_deferred', 'ira', 'roth_ira', 'cash_reserve', 'income',
]

export const useWorkspaceStore = defineStore('workspace', () => {
    const isOpen = ref(false)
    const modelName = ref<ModelName | null>(null)
    const id = ref<number | null>(null)
    const planId = ref<number | null>(null)

    const mode = computed<'create' | 'edit'>(() => (id.value === null ? 'create' : 'edit'))

    function open(model: ModelName, entityId: number) {
        modelName.value = model
        id.value = entityId
        planId.value = null
        isOpen.value = true
    }

    function openCreate(model: ModelName, forPlanId: number) {
        modelName.value = model
        id.value = null
        planId.value = forPlanId
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
        modelName.value = null
        id.value = null
        planId.value = null
    }

    return {isOpen, modelName, id, planId, mode, open, openCreate, close}
})