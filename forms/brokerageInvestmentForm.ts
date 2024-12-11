import * as yup from "yup";
import type {BrokerageContributionStrategy, BrokerageInvestmentPartial} from "~/models/brokerage/BrokerageInvestment";
import type {FieldData} from "~/interfaces/FieldData";

export const brokerageInvestmentFields: Record<keyof BrokerageInvestmentPartial, FieldData> = {
    name: {
        name: "name",
        label: "Investment Name",
        placeholder: "Enter investment name",
        helpText: "Provide a descriptive name for this investment.",
        type: "text",
        defaultValue: "Default Investment",
        rules: yup
            .string()
            .required("Investment name is required")
            .min(3, "Investment name must be at least 3 characters long.")
            .max(50, "Investment name must be at most 50 characters long."),
    },
    growthRate: {
        name: "growthRate",
        label: "Growth Rate (%)",
        placeholder: "Enter growth rate",
        helpText: "Specify the annual growth rate as a percentage.",
        type: "number",
        defaultValue: 5,
        rules: yup
            .number()
            .required("Growth rate is required")
            .min(0, "Growth rate cannot be negative.")
            .max(100, "Growth rate must be less than or equal to 100."),
    },
    initialBalance: {
        name: "initialBalance",
        label: "Initial Balance",
        placeholder: "Enter initial balance",
        helpText: "Set the starting balance for this investment.",
        type: "number",
        defaultValue: 1000,
        rules: yup
            .number()
            .required("Initial balance is required")
            .min(0, "Initial balance cannot be negative."),
    },
    contributionStrategy: {
        name: "contributionStrategy",
        label: "Contribution Strategy",
        placeholder: "Select contribution strategy",
        helpText: "Choose the strategy for contributions.",
        type: "select",
        defaultValue: "fixed",
        rules: yup
            .mixed<BrokerageContributionStrategy>()
            .required("Contribution strategy is required"),
        options: [
            {label: "Fixed", value: "fixed"},
            {label: "Percentage of Income", value: "percentage_of_income"},
            {label: "Max Disposable Income", value: "max"},
        ],
    },
    contributionPercentage: {
        name: "contributionPercentage",
        label: "Contribution Percentage (%)",
        placeholder: "Enter percentage",
        helpText: "Set the percentage of income to contribute. Only applicable for 'Percentage of Income' strategy.",
        type: "number",
        defaultValue: 10,
        rules: yup
            .number()
            .required("Contribution percentage is required")
            .min(0, "Contribution percentage cannot be negative.")
            .max(100, "Contribution percentage must be less than or equal to 100."),
    },
    contributionFixedAmount: {
        name: "contributionFixedAmount",
        label: "Fixed Contribution Amount",
        placeholder: "Enter fixed amount",
        helpText: "Specify the fixed contribution amount. Only applicable for 'Fixed' strategy.",
        type: "number",
        defaultValue: 500,
        rules: yup
            .number()
            .required("Fixed contribution amount is required")
            .min(0, "Contribution amount cannot be negative."),
    },
};
