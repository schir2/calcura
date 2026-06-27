import type {ModelName} from '#shared/types/ModelName'
import type {ModalAction, ModalPayload} from '~/types/Modal'

export const useModalStore = defineStore('modal', () => {
    const action = ref<ModalAction | null>(null)
    const model = ref<ModelName | null>(null)
    const payload = ref<ModalPayload<ModalAction, ModelName> | null>(null)

    function open<TAction extends ModalAction, TModel extends ModelName>(
        modalAction: TAction,
        modalModel: TModel,
        modalPayload: ModalPayload<TAction, TModel>
    ) {
        action.value = modalAction
        model.value = modalModel
        payload.value = modalPayload as ModalPayload<ModalAction, ModelName>
    }

    function close() {
        action.value = null
        model.value = null
        payload.value = null
    }

    function payloadFor<TAction extends ModalAction, TModel extends ModelName>(
        modalAction: TAction,
        modalModel: TModel
    ): ModalPayload<TAction, TModel> | null {
        if (action.value === modalAction && model.value === modalModel)
            return payload.value as ModalPayload<TAction, TModel>
        return null
    }

    return {action, model, payload, open, close, payloadFor}
})