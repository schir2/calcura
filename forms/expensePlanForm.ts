import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import {EXPENSE_PLAN_NAME_MAX_LENGTH, EXPENSE_PLAN_NAME_MIN_LENGTH, ExpenseGrowthStrategy, ExpensePlanType} from "~/models/expense/ExpensePlanConfig";

export const expensePlanFields: Record<string, FieldData> = {
    name: {
        name: "name",
        label: "Plan Name",
        placeholder: "Enter expense plan name",
        helpText: "Provide a descriptive name for your expense plan.",
        type: "text",
        defaultValue: "Default Expense Plan",
        rules: yup
            .string()
            .required("Expense plan name is required")
            .min(EXPENSE_PLAN_NAME_MIN_LENGTH, `Plan name must be at least ${EXPENSE_PLAN_NAME_MIN_LENGTH} characters long.`)
            .max(EXPENSE_PLAN_NAME_MAX_LENGTH, `Plan name must be at most ${EXPENSE_PLAN_NAME_MAX_LENGTH} characters long.`),
    },
    planType: {
        name: "planType",
        label: "Plan Type",
        placeholder: "Select plan type",
        helpText: "Choose between a simple or itemized expense plan.",
        type: "select",
        defaultValue: ExpensePlanType.Simple,
        rules: yup
            .mixed<ExpensePlanType>()
            .required("Plan type is required"),
        options: [
            {label: "Simple", value: ExpensePlanType.Simple},
            {label: "Itemized", value: ExpensePlanType.Itemized},
        ],
    },
    growthStrategy: {
        name: "growthStrategy",
        label: "Growth Strategy",
        placeholder: "Select growth strategy",
        helpText: "Choose how your expenses will grow over time.",
        type: "select",
        defaultValue: ExpenseGrowthStrategy.Inflation,
        rules: yup
            .mixed<ExpenseGrowthStrategy>()
            .required("Growth strategy is required"),
        options: [
            {label: "Fixed", value: ExpenseGrowthStrategy.Fixed},
            {label: "Inflation", value: ExpenseGrowthStrategy.Inflation},
            {label: "Percentage of Income", value: ExpenseGrowthStrategy.PercentageOfIncome},
            {label: "No Growth", value: ExpenseGrowthStrategy.NoGrowth},
        ],
    },
};
