import * as yup from "yup";
import type {FormData} from "~/interfaces/FieldData";
import {createSchema} from "~/utils/schemaUtils";
import type {Plan} from "~/models/plan/Plan";

export const planForm: FormData<Plan> = {
    name: {
        name: 'name',
        label: 'Name',
        placeholder: 'Enter income name',
        helpText: `Enter a name between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long`,
        rules: yup
            .string()
            .required('Name is required')
            .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters long.`)
            .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`),
    },
    age: {
        name: "age",
        label: 'Age',
        placeholder: 'Enter Starting Age',
        helpText: `Enter an age between ${MIN_AGE} and ${MAX_AGE} years.`,
        rules: yup.number().min(MIN_AGE).max(MAX_AGE)
    },

    inflationRate: {
        name: 'inflationRate',
        label: 'Inflation Rate',
        placeholder: 'Enter Inflation Rate',
        helpText: 'The rate at which inflation grows',
        rules: yup.number().required('Inflation rate is required')
    },
    insufficientFundsStrategy: {
        name: 'insufficientFundsStrategy',
        label: 'Allow Negative Funds',
        helpText: 'Choose weather to allow negative disposable income.',
        options: [
            {value: 'none', label: 'No'},
            {value: 'minimum_only', label: 'Only to meet Minimums'},
            {value: 'full', label: 'Allow'},
        ]

    },
    growthRate: {
        name: 'growthRate',
        label: 'Growth Rate',
        placeholder: 'Enter growth Rate',
        helpText: 'The rate at which growth grows',
        rules: yup.number().required('Growth rate is required')
    },
    growthApplicationStrategy: {
        name: 'growthApplicationStrategy',
        label: 'Growth Application Strategy',
        helpText: `Select when growth is calculated`,
        options: [
            {value: 'start', label: 'Start of Year'},
            {value: 'end', label: 'End of Year'},
        ]
    },

    year: {
        name: "year",
        label: 'Year',
        placeholder: 'Enter Starting Year',
        helpText: 'Enter the year in the retirement journey',
        rules: yup.number().min(2000).required('Year is required'),

    },
    lifeExpectancy: {
        name: "lifeExpectancy",
        label: "Life Expectancy",
        placeholder: "Enter your estimated life expectancy",
        helpText: "This is the age to which you expect to live.",
        resourceId: "life-expectancy",
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
        rules: yup.mixed().required("Retirement strategy is required"),
        options: [
            {label: 'Age', value: 'age'},
            {label: 'Debt Free', value: 'debt_free'},
            {label: 'Percent Rule', value: 'percent_rule'},
            {label: 'Savings Amount', value: 'target_savings'}
        ],
    },
    retirementWithdrawalRate: {
        name: "retirementWithdrawalRate",
        label: "Retirement Withdrawal Rate (%)",
        placeholder: "Enter your planned withdrawal rate",
        helpText: "The percentage of your retirement savings you plan to withdraw annually.",
        resourceId: "retirement-withdrawal-rate",
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
        rules: yup
            .number()
            .required("Retirement savings amount is required")
            .min(0, "Retirement savings must be at least $0.")
            .max(MAX_RETIREMENT_SAVINGS_AMOUNT, `Retirement savings must be at most $${MAX_RETIREMENT_SAVINGS_AMOUNT}.`),
    },
    retirementIncomeAdjustedForInflation: {
        name: "retirementIncomeAdjustedForInflation",
        label: "Retirement Income Goal Adjusted For Inflation",
        helpText: "Select this if you want your retirement income goal to be adjusted for inflation.",
    },
    taxStrategy: {
        name: 'taxStrategy',
        label: 'Tax Strategy',
        placeholder: 'Select tax strategy',
        helpText: 'Select how this income is taxed.',
        rules: yup.mixed().required('Tax strategy is required'),
        options: [
            {label: "Simple", value: 'simple'}
        ],
    },
    taxRate: {
        name: 'taxRate',
        label: 'Tax Rate (%)',
        placeholder: 'Enter tax rate',
        helpText: 'Effective tax rate for this income.',
        rules: yup
            .number()
            .required('Tax rate is required')
            .min(MIN_TAX_RATE, 'Tax rate cannot be negative.')
            .max(MAX_TAX_RATE, 'Tax rate must be 100% or less.'),
    },
}

export const planFormSchema = createSchema(planForm)