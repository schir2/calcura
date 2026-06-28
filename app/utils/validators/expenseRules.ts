import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {Expense} from "#shared/types/Expense";

export function expenseRules(modelRef: Ref<Partial<Expense>>) {
    const rules: FormRules = {
        name: [
            {required: true, message: "Expense name is required", trigger: ["blur", "change"]},
            {min: MIN_NAME_LENGTH, message: `Expense name must be at least ${MIN_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]},
            {max: MAX_NAME_LENGTH, message: `Expense name must be at most ${MAX_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]}
        ],
        amount: [
            {required: true, type: "number", message: "Expense amount is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_EXPENSE_AMOUNT, message: `Amount must be at least $${MIN_EXPENSE_AMOUNT}.`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_EXPENSE_AMOUNT, message: `Amount must not exceed $${MAX_EXPENSE_AMOUNT}.`, trigger: ["blur", "change"]}
        ],
        expense_type: [
            {required: true, message: "Expense type is required", trigger: ["blur", "change"]}
        ],
        frequency: [
            {required: true, message: "Frequency is required", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
