import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY,} from "~/constants/financial";
import {
    DEFAULT_DAX_DEFERRED_GROWTH_RATE,
    DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT,
    DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
    DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE,
    DEFAULT_EMPLOYER_CONTRIBUTES,
    DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT,
    DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
    TaxDeferredContributionOptions,
} from "~/constants/taxDeferred";
import {EmployerContributionOptions} from "~/constants/employerContribution";

export const taxDeferredInvestmentFields: Record<keyof TaxDeferredInvestmentData, FieldData> = {
    name: {
        name: "name",
        label: "Investment Name",
        placeholder: "Enter the name of the investment",
        helpText: "This is the name of your tax-deferred investment.",
        resourceId: "investment-name",
        type: "text",
        defaultValue: "",
        rules: yup.string().required("Name is required").min(3, "Name must be at least 3 characters long").max(32, "Name must be at most 32 characters long"),
    },
    growthRate: {
        name: 'growthRate',
        label: "Growth Rate",
        placeholder: "Enter expected growth rate",
        helpText: "The annual percentage growth rate of your investment.",
        resourceId: "growth-rate",
        type: "number",
        defaultValue: DEFAULT_DAX_DEFERRED_GROWTH_RATE,
        rules: yup
            .number()
            .min(0, "Growth rate must be at least 0")
            .max(100, "Growth rate must be at most 100")
            .required("Growth rate is required"),
    },
    balance: {
        name: "balance",
        label: "Current Savings",
        placeholder: "Enter your current savings balance",
        helpText: "This is the total amount you have saved so far.",
        resourceId: "current-savings",
        type: "number",
        defaultValue: 0,
        rules: yup
            .number()
            .min(0, "Balance must be at least 0")
            .required("Balance is required"),
    },
    growthApplicationStrategy: {
        name: "growthApplicationStrategy",
        label: "Growth Application Strategy",
        placeholder: "Select growth application strategy",
        helpText: "Determines when the growth is applied to your investment.",
        resourceId: "growth-application-strategy",
        type: "select",
        defaultValue: DEFAULT_GROWTH_APPLICATION_STRATEGY,
        rules: yup.string().required("Growth application strategy is required"),
    },
    electiveContributionStrategy: {
        name: "electiveContributionStrategy",
        label: "Elective Contribution Strategy",
        placeholder: "Select elective contribution strategy",
        helpText: "Determines how you contribute to your investment.",
        resourceId: "elective-contribution-strategy",
        type: "select",
        options: TaxDeferredContributionOptions,
        defaultValue: DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
        rules: yup.string().required("Elective contribution strategy is required"),
    },
    electiveContributionPercentage: {
        name: "electiveContributionPercentage",
        label: "Elective Contribution Percentage",
        placeholder: "Enter elective contribution percentage",
        helpText: "Percentage of your income contributed to the investment.",
        resourceId: "elective-contribution-percentage",
        type: "number",
        defaultValue: DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
        rules: yup
            .number()
            .min(0, "Elective contribution percentage must be at least 0")
            .max(100, "Elective contribution percentage must be at most 100")
            .required("Elective contribution percentage is required"),
    },
    electiveContributionFixedAmount: {
        name: "electiveContributionAmount",
        label: "Elective Contribution Fixed Amount",
        placeholder: "Enter elective contribution fixed amount",
        helpText: "Fixed amount you contribute to the investment.",
        resourceId: "elective-contribution-fixed-amount",
        type: "number",
        defaultValue: DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT,
        rules: yup
            .number()
            .min(0, "Elective contribution fixed amount must be at least 0")
            .required("Elective contribution fixed amount is required"),
    },
    employerContributes: {
        name: "employerContributes",
        label: "Does your employer contribute?",
        helpText: "Indicates whether your employer contributes to your investment.",
        resourceId: "employer-contributes",
        type: "checkbox",
        defaultValue: DEFAULT_EMPLOYER_CONTRIBUTES,
    },
    employerContributionStrategy: {
        name: "employerContributionStrategy",
        label: "Employer Contribution Strategy",
        placeholder: "Select employer contribution strategy",
        helpText: "Determines how your employer contributes to your investment.",
        resourceId: "employer-contribution-strategy",
        type: "select",
        options: EmployerContributionOptions,
        defaultValue: DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
        rules: yup.string().required("Employer contribution strategy is required"),
    },
    employerCompensationMatchPercentage: {
        name: "employerCompensationMatchPercentage",
        label: "Employer Compensation Match Percentage",
        placeholder: "Enter employer compensation match percentage",
        helpText: "Percentage of your compensation that your employer matches.",
        resourceId: "employer-compensation-match-percentage",
        type: "number",
        defaultValue: DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE,
        rules: yup
            .number()
            .min(0, "Employer compensation match percentage must be at least 0")
            .max(100, "Employer compensation match percentage must be at most 100")
            .required("Employer compensation match percentage is required"),
    },
    employerContributionFixedAmount: {
        name: "employerContributionFixedAmount",
        label: "Employer Contribution Fixed Amount",
        placeholder: "Enter employer contribution fixed amount",
        helpText: "Fixed amount your employer contributes to your investment.",
        resourceId: "employer-contribution-fixed-amount",
        type: "number",
        defaultValue: DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT,
        rules: yup
            .number()
            .min(0, "Employer contribution fixed amount must be at least 0")
            .required("Employer contribution fixed amount is required"),
    },
    employerMatchPercentage: {
        name: "employerMatchPercentage",
        label: "Employer Match Percentage",
        placeholder: "Enter employer match percentage",
        helpText: "Percentage of your contributions that your employer matches.",
        resourceId: "employer-match-percentage",
        type: "number",
        defaultValue: DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
        rules: yup
            .number()
            .min(0, "Employer match percentage must be at least 0")
            .max(100, "Employer match percentage must be at most 100")
            .required("Employer match percentage is required"),
    },
    employerMatchPercentageLimit: {
        name: "employerMatchPercentageLimit",
        label: "Employer Match Percentage Limit",
        placeholder: "Enter employer match percentage limit",
        helpText: "Maximum percentage your employer will match.",
        resourceId: "employer-match-percentage-limit",
        type: "number",
        defaultValue: DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
        rules: yup
            .number()
            .min(0, "Employer match percentage limit must be at least 0")
            .max(100, "Employer match percentage limit must be at most 100")
            .required("Employer match percentage limit is required"),
    },
}
