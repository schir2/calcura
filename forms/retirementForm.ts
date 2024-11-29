import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import type {RetirementData} from "~/models/retirement/RetirementConfig";
import {
    DEFAULT_RETIREMENT_AGE,
    DEFAULT_RETIREMENT_INCOME_GOAL,
    DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
    DEFAULT_RETIREMENT_PLAN_NAME,
    DEFAULT_RETIREMENT_SAVINGS_AMOUNT,
    DEFAULT_RETIREMENT_WITHDRAWAL_RATE,
    MAX_RETIREMENT_AGE_FOR_WITHDRAWAL,
    MAX_RETIREMENT_INCOME_GOAL,
    MAX_RETIREMENT_LIFE_EXPECTANCY,
    MAX_RETIREMENT_SAVINGS_AMOUNT,
    MAX_RETIREMENT_WITHDRAWAL_RATE,
    MIN_RETIREMENT_AGE_FOR_WITHDRAWAL,
    MIN_RETIREMENT_INCOME_GOAL,
    MIN_RETIREMENT_LIFE_EXPECTANCY,
    MIN_RETIREMENT_WITHDRAWAL_RATE,
} from "~/models/retirement/RetirementConstants";
import type {SelectOption} from "~/components/form/Select.vue";
import type {RetirementStrategy} from "~/types";
import {MAX_NAME_LENGTH, MIN_NAME_LENGTH} from "~/models/income/IncomeConstants";

export const retirementStrategyOptions: Record<RetirementStrategy, SelectOption> = {
    age: {label: 'Age', value: 'age'},
    debitFree: {label: 'Debt Free', value: 'debtFree'},
    percentRule: {label: 'Percent Rule', value: 'percentRule'},
    targetSavings: {label: 'Savings Amount', value: 'targetSavings'}
} as const;

export const retirementFields: Record<keyof RetirementData, FieldData> = {
    name: {
        name: 'name',
        label: 'Name',
        placeholder: 'Enter income name',
        helpText: 'Enter a descriptive name for this income source.',
        type: 'text',
        defaultValue: DEFAULT_RETIREMENT_PLAN_NAME,
        rules: yup
            .string()
            .required('Name is required')
            .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters long.`)
            .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`),
    },
    lifeExpectancy: {
        name: "lifeExpectancy",
        label: "Life Expectancy",
        placeholder: "Enter your estimated life expectancy",
        helpText: "This is the age to which you expect to live.",
        resourceId: "life-expectancy",
        type: "number",
        defaultValue: DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
        rules: yup
            .number()
            .required("Life expectancy is required")
            .min(MIN_RETIREMENT_LIFE_EXPECTANCY, `Life expectancy must be at least ${MIN_RETIREMENT_LIFE_EXPECTANCY}.`)
            .max(MAX_RETIREMENT_LIFE_EXPECTANCY, `Life expectancy must be at most ${MAX_RETIREMENT_LIFE_EXPECTANCY}.`),
    },
    retirementStrategy: {
        name: "retirementStrategy",
        label: "Retirement Strategy",
        placeholder: "Select your retirement strategy",
        helpText: "Choose the strategy you plan to follow for retirement.",
        resourceId: "retirement-strategy",
        type: "select",
        defaultValue: "age",
        rules: yup.mixed().required("Retirement strategy is required"),
        options: retirementStrategyOptions,
    },
    retirementWithdrawalRate: {
        name: "retirementWithdrawalRate",
        label: "Retirement Withdrawal Rate (%)",
        placeholder: "Enter your planned withdrawal rate",
        helpText: "The percentage of your retirement savings you plan to withdraw annually.",
        resourceId: "retirement-withdrawal-rate",
        type: "number",
        defaultValue: DEFAULT_RETIREMENT_WITHDRAWAL_RATE,
        rules: yup
            .number()
            .required("Withdrawal rate is required")
            .min(MIN_RETIREMENT_WITHDRAWAL_RATE, `Withdrawal rate must be at least ${MIN_RETIREMENT_WITHDRAWAL_RATE}%.`)
            .max(MAX_RETIREMENT_WITHDRAWAL_RATE, `Withdrawal rate must be at most ${MAX_RETIREMENT_WITHDRAWAL_RATE}%.`),
    },
    retirementIncomeGoal: {
        name: "retirementIncomeGoal",
        label: "Retirement Income Goal",
        placeholder: "Enter your desired annual retirement income",
        helpText: "The amount of money you want to have as annual income during retirement.",
        resourceId: "retirement-income-goal",
        type: "number",
        defaultValue: DEFAULT_RETIREMENT_INCOME_GOAL,
        rules: yup
            .number()
            .required("Retirement income goal is required")
            .min(MIN_RETIREMENT_INCOME_GOAL, `Income goal must be at least $${MIN_RETIREMENT_INCOME_GOAL}.`)
            .max(MAX_RETIREMENT_INCOME_GOAL, `Income goal must be at most $${MAX_RETIREMENT_INCOME_GOAL}.`),
    },
    retirementAge: {
        name: "retirementAge",
        label: "Retirement Age",
        placeholder: "Enter your desired retirement age",
        helpText: "The age at which you plan to retire.",
        resourceId: "retirement-age-goal",
        type: "number",
        defaultValue: DEFAULT_RETIREMENT_AGE,
        rules: yup
            .number()
            .required("Retirement age is required")
            .min(MIN_RETIREMENT_AGE_FOR_WITHDRAWAL, `Retirement age must be at least ${MIN_RETIREMENT_AGE_FOR_WITHDRAWAL}.`)
            .max(MAX_RETIREMENT_AGE_FOR_WITHDRAWAL, `Retirement age must be at most ${MAX_RETIREMENT_AGE_FOR_WITHDRAWAL}.`),
    },
    retirementSavingsAmount: {
        name: "retirementSavingsAmount",
        label: "Retirement Savings Amount",
        placeholder: "Enter your current retirement savings amount",
        helpText: "The total amount of savings you currently have set aside for retirement.",
        resourceId: "retirement-savings-amount",
        type: "number",
        defaultValue: DEFAULT_RETIREMENT_SAVINGS_AMOUNT,
        rules: yup
            .number()
            .required("Retirement savings amount is required")
            .min(0, "Retirement savings must be at least $0.")
            .max(MAX_RETIREMENT_SAVINGS_AMOUNT, `Retirement savings must be at most $${MAX_RETIREMENT_SAVINGS_AMOUNT}.`),
    },
}

