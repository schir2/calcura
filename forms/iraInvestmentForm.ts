import * as yup from "yup";
import type {FormData} from "~/interfaces/FieldData";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {IraContributionStrategy} from "~/types";

export const iraInvestmentForm: FormData<IraInvestment> = {
    name: {
        name: "name",
        label: "Investment Name",
        placeholder: "Enter the name of the investment",
        helpText: "This is the name of your tax-deferred investment.",
        resourceId: "investment-name",
        rules: yup.string().required("Name is required").min(3, "Name must be at least 3 characters long").max(32, "Name must be at most 32 characters long"),
    },
    isContributionTaxDeferred: {
        name: 'iraType',
        label: 'Is Contribution Tax Deferred?',
        helpText: "Choose between Tax Deferred or Post Tax Contribution",
        resourceId: "ira-contribution-type",
    },
    growthRate: {
        name: 'growthRate',
        label: "Growth Rate",
        placeholder: "Enter expected growth rate",
        helpText: "The annual percentage growth rate of your investment.",
        resourceId: "growth-rate",
        rules: yup
            .number()
            .min(0, "Growth rate must be at least 0")
            .max(100, "Growth rate must be at most 100")
            .required("Growth rate is required"),
    },
    initialBalance: {
        name: "balance",
        label: "Current Savings",
        placeholder: "Enter your current savings balance",
        helpText: "This is the total amount you have saved so far.",
        resourceId: "current-savings",
        rules: yup
            .number()
            .min(0, "Balance must be at least 0")
            .required("Balance is required"),
    },
    contributionStrategy: {
        name: "contributionStrategy",
        label: "Contribution Strategy",
        placeholder: "Select contribution strategy",
        helpText: "Choose the strategy for contributions.",
        rules: yup
            .mixed<IraContributionStrategy>()
            .required("Contribution strategy is required"),
        options: [
            {label: "Fixed", value: "fixed"},
            {label: "Percentage of Income", value: "percentage_of_income"},
            {label: "Max Disposable Income", value: "max"},
        ],
    },
    contributionPercentage: {
        name: "electiveContributionPercentage",
        label: "Elective Contribution Percentage",
        placeholder: "Enter elective contribution percentage",
        helpText: "Percentage of your income contributed to the investment.",
        resourceId: "elective-contribution-percentage",
        rules: yup
            .number()
            .min(0, "Elective contribution percentage must be at least 0")
            .max(100, "Elective contribution percentage must be at most 100")
            .required("Elective contribution percentage is required"),
    },
    contributionFixedAmount: {
        name: "electiveContributionAmount",
        label: "Elective Contribution Fixed Amount",
        placeholder: "Enter elective contribution fixed amount",
        helpText: "Fixed amount you contribute to the investment.",
        resourceId: "elective-contribution-fixed-amount",
        rules: yup
            .number()
            .min(0, "Elective contribution fixed amount must be at least 0")
            .required("Elective contribution fixed amount is required"),
    },
}

export const iraInvestmentFormSchema = createSchema(iraInvestmentForm)