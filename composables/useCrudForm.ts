import type {FormInst} from 'naive-ui'

export function useCrudForm<T>(
    emit: (event: "create" | "update" | "cancel", payload?: T,) => void,
    formRef: Ref<FormInst | null>,
    modelRef: Ref<T>) {


    function handleCreate() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                emit('create', modelRef.value)
            }
        })

    }

    function handleCancel() {
        emit('cancel')
    }

    function handleUpdate() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                emit('update', modelRef.value)
            }
        })
    }

    return {
        handleCreate,
        handleUpdate,
        handleCancel
    };
}