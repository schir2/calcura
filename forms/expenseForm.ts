import * as yup from "yup";
import type {ExpensePartial} from "~/models/expense/Expense";
import {ExpenseFrequency, ExpenseType} from "~/models/expense/Expense";
import type {Field, NumberField, SelectField} from "~/interfaces/FieldData";
import {EXPENSE_NAME_MAX_LENGTH, EXPENSE_NAME_MIN_LENGTH, MAX_EXPENSE_AMOUNT, MIN_EXPENSE_AMOUNT,} from "~/models/expense/ExpenseConstants";
import {createSchema} from "~/utils/schemaUtils";
import type {IncomePartial} from "~/models/income/Income";
import {incomeFields} from "~/forms/incomeForm";

export const expenseFields: Record<keyof ExpensePartial, Field | SelectField | NumberField> = {
    name: {
        name: "name",
        label: "Expense Name",
        placeholder: "Enter expense name",
        helpText: "Provide a descriptive name for this expense.",
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
        rules: yup
            .number()
            .required("Expense amount is required")
            .min(MIN_EXPENSE_AMOUNT, `Amount must be at least $${MIN_EXPENSE_AMOUNT}.`)
            .max(MAX_EXPENSE_AMOUNT, `Amount must not exceed $${MAX_EXPENSE_AMOUNT}.`),
    },
    expenseType: {
        name: "expenseType",
        label: "Expense Type",
        placeholder: "Select type",
        helpText: "Choose whether this expense is fixed or variable.",
        rules: yup
            .mixed<ExpenseType>()
            .required("Expense type is required"),
        options: [
            {label: "Fixed", value: ExpenseType.fixed},
            {label: "Variable", value: ExpenseType.variable},
        ],
    },
    frequency: {
        name: "frequency",
        label: "Frequency",
        placeholder: "Select frequency",
        helpText: "Specify how often this expense occurs.",
        rules: yup
            .mixed<ExpenseFrequency>()
            .required("Frequency is required"),
        options: [
            {label: "Monthly", value: ExpenseFrequency.monthly},
            {label: "Weekly", value: ExpenseFrequency.weekly},
            {label: "Quarterly", value: ExpenseFrequency.quarterly},
            {label: "Annually", value: ExpenseFrequency.annually},
            {label: "One Time", value: ExpenseFrequency.one_time},
        ],
    },
    isEssential: {
        name: "isEssential",
        label: "Essential Expense",
        helpText: "Mark this expense as essential if it is critical for your budget.",
    },
    isTaxDeductible: {
        name: "isTaxDeductible",
        label: "Tax Deductible",
        helpText: "Check this if the expense is tax deductible.",
    },
};

export const expenseFormSchema = createSchema<IncomePartial>(incomeFields);