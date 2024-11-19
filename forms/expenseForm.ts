import * as yup from "yup";
import type { ExpenseData } from "~/models/Expense";
import type { FieldData } from "~/interfaces/FieldData";
import { Frequency, ExpenseType } from "~/models/Expense";
import {
    MIN_EXPENSE_AMOUNT,
    MAX_EXPENSE_AMOUNT,
    EXPENSE_NAME_MIN_LENGTH,
    EXPENSE_NAME_MAX_LENGTH,
} from "~/constants/expense";

export const expenseFields: Record<keyof ExpenseData, FieldData> = {
    name: {
        name: "name",
        label: "Expense Name",
        placeholder: "Enter expense name",
        helpText: "Provide a descriptive name for this expense.",
        type: "text",
        defaultValue: "Simple Expense",
        rules: yup
            .string()
            .required("Expense name is required")
            .min(EXPENSE_NAME_MIN_LENGTH, `Expense name must be at least ${EXPENSE_NAME_MIN_LENGTH} characters long.`)
            .max(EXPENSE_NAME_MAX_LENGTH, `Expense name must be at most ${EXPENSE_NAME_MAX_LENGTH} characters long.`),
    },
    amount: {
        name: "amount",
        label: "Expense Amount",
        placeholder: "Enter amount",
        helpText: "The monetary value of the expense.",
        type: "number",
        defaultValue: 0,
        rules: yup
            .number()
            .required("Expense amount is required")
            .min(MIN_EXPENSE_AMOUNT, `Amount must be at least $${MIN_EXPENSE_AMOUNT}.`)
            .max(MAX_EXPENSE_AMOUNT, `Amount must not exceed $${MAX_EXPENSE_AMOUNT}.`),
    },
    type: {
        name: "type",
        label: "Expense Type",
        placeholder: "Select type",
        helpText: "Choose whether this expense is fixed or variable.",
        type: "select",
        defaultValue: ExpenseType.Fixed,
        rules: yup
            .mixed<ExpenseType>()
            .required("Expense type is required"),
        options: [
            { label: "Fixed", value: ExpenseType.Fixed },
            { label: "Variable", value: ExpenseType.Variable },
        ],
    },
    frequency: {
        name: "frequency",
        label: "Frequency",
        placeholder: "Select frequency",
        helpText: "Specify how often this expense occurs.",
        type: "select",
        defaultValue: Frequency.Annually,
        rules: yup
            .mixed<Frequency>()
            .required("Frequency is required"),
        options: [
            { label: "Monthly", value: Frequency.Monthly },
            { label: "Weekly", value: Frequency.Weekly },
            { label: "Quarterly", value: Frequency.Quarterly },
            { label: "Annually", value: Frequency.Annually },
            { label: "One Time", value: Frequency.OneTime },
        ],
    },
    isEssential: {
        name: "isEssential",
        label: "Essential Expense",
        helpText: "Mark this expense as essential if it is critical for your budget.",
        type: "checkbox",
        defaultValue: true,
        rules: yup.boolean().required(),
    },
    isTaxDeductible: {
        name: "isTaxDeductible",
        label: "Tax Deductible",
        helpText: "Check this if the expense is tax deductible.",
        type: "checkbox",
        defaultValue: false,
        rules: yup.boolean().required(),
    },
};
