import * as yup from "yup";
import type {FormData} from "~/interfaces/FieldData";
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";
import {RothIraContributionStrategy} from "~/models/rothIraInvestment/RothIraInvestment";

export const rothIraInvestmentForm: FormData<RothIraInvestment> = {
    name: {
        name: "name",
        label: "Investment Name",
        placeholder: "Enter the name of the investment",
        helpText: "This is the name of your tax-deferred investment.",
        resourceId: "investment-name",
        rules: yup.string().required("Name is required").min(3, "Name must be at least 3 characters long").max(32, "Name must be at most 32 characters long"),
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
            .mixed<RothIraContributionStrategy>()
            .required("Contribution strategy is required"),
        options: [
            {label: "Fixed", value: "fixed"},
            {label: "Percentage of Income", value: "percentage_of_income"},
            {label: "Max Disposable Income", value: "max"},
        ],
    },
    contributionPercentage: {
        name: "contributionPercentage",
        label: "Contribution Percentage",
        placeholder: "Enter contribution percentage",
        helpText: "Percentage of your income contributed to the investment.",
        resourceId: "contribution-percentage",
        rules: yup
            .number()
            .min(0, "contribution percentage must be at least 0")
            .max(100, "contribution percentage must be at most 100")
            .required("contribution percentage is required"),
    },
    contributionFixedAmount: {
        name: "contributionAmount",
        label: "Annual Contribution",
        placeholder: "Enter  contribution fixed amount",
        helpText: "Fixed amount you contribute to the investment.",
        resourceId: "contribution-fixed-amount",
        rules: yup
            .number()
            .min(0, "contribution fixed amount must be at least 0")
            .required("contribution fixed amount is required"),
    },
}

export const rothIraInvestmentFormSchema = createSchema(rothIraInvestmentForm)