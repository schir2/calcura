import * as yup from "yup";
import {type Expense, Frequency, ExpenseType} from "~/models/expense/Expense";
import type {FormData} from "~/interfaces/FieldData";
import {EXPENSE_NAME_MAX_LENGTH, EXPENSE_NAME_MIN_LENGTH, MAX_EXPENSE_AMOUNT, MIN_EXPENSE_AMOUNT,} from "~/models/expense/ExpenseConstants";
import {createSchema} from "~/utils/schemaUtils";
import type {IncomePartial} from "~/models/income/Income";
import {incomeForm} from "~/forms/incomeForm";

export const expenseForm: FormData<Expense> = {
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
            .mixed<Frequency>()
            .required("Frequency is required"),
        options: [
            {label: "Monthly", value: Frequency.Monthly},
            {label: "Weekly", value: Frequency.Weekly},
            {label: "Quarterly", value: Frequency.Quarterly},
            {label: "Annually", value: Frequency.Annually},
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

    growsWithInflation: {
        name: "growsWithInflation",
        label: "Grows With Inflation",
        helpText: "Grows With Inflation.",
    },

    growthRate: {
        name: "growthRate",
        label: "Growth Rate",
        helpText: "The Rate at which this expense grows Annually)"
    }
};

export const expenseFormSchema = createSchema<IncomePartial>(incomeForm);