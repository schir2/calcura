import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {Expense} from "~/types/Expense";
import {
    EXPENSE_NAME_MAX_LENGTH,
    EXPENSE_NAME_MIN_LENGTH,
    MAX_EXPENSE_AMOUNT,
    MIN_EXPENSE_AMOUNT
} from "~/constants/ExpenseConstants";

export function useExpenseValidation(modelRef: Ref<Partial<Expense>>) {
    const rules: FormRules = {
        name: [
            {required: true, message: "Expense name is required", trigger: ["blur", "change"]},
            {
                min: EXPENSE_NAME_MIN_LENGTH,
                message: `Expense name must be at least ${EXPENSE_NAME_MIN_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            },
            {
                max: EXPENSE_NAME_MAX_LENGTH,
                message: `Expense name must be at most ${EXPENSE_NAME_MAX_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            }
        ],
        amount: [
            {required: true, type: "number", message: "Expense amount is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_EXPENSE_AMOUNT,
                message: `Amount must be at least $${MIN_EXPENSE_AMOUNT}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_EXPENSE_AMOUNT,
                message: `Amount must not exceed $${MAX_EXPENSE_AMOUNT}.`,
                trigger: ["blur", "change"]
            }
        ],
        expenseType: [
            {required: true, message: "Expense type is required", trigger: ["blur", "change"]}
        ],
        frequency: [
            {required: true, message: "Frequency is required", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
