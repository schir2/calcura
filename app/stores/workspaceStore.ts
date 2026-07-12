import type {ModelName} from '#shared/types/ModelName'

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