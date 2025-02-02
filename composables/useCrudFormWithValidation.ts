import type {Ref} from "vue";
import {ref} from "vue";
import type {FormInst, FormRules} from "naive-ui";

/**
 * A reusable composable that handles CRUD form operations and validation for any model type.
 *
 * @param initialValues - The initial model data
 * @param emit - The emit function for handling form events
 * @param useValidator - A composable function that returns validation rules for the given model
 */
export function useCrudFormWithValidation<T>(
    initialValues: Partial<T>,
    emit: (event: "create" | "update" | "cancel", payload?: T) => void,
    useValidator: (modelRef: Ref<Partial<T>>) => { rules: FormRules }
) {
    const formRef = ref<FormInst | null>(null);
    const modelRef = ref<Partial<T>>(initialValues);
    const {rules} = useValidator(modelRef);

    function handleCreate() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                emit("create", modelRef.value as T);
            }
        });
    }

    function handleUpdate() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                emit("update", modelRef.value as T);
            }
        });
    }

    function handleCancel() {
        emit("cancel");
    }

    return {
        formRef,
        modelRef,
        rules,
        handleCreate,
        handleUpdate,
        handleCancel
    };
}
