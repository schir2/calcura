import {
    TaxDeferredContributionStrategy,
    type TaxDeferred
} from "~/types/TaxDeferred";
import type {FormItemRule, FormRules} from "naive-ui";

export function useTaxDeferredValidator(modelRef: Ref<Partial<TaxDeferred>>) {
    function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.elective_contribution_strategy === "fixed" && (value === null || value === undefined)) {
            return new Error("Fixed contribution amount is required when Fixed Contribution strategy is selected");
        }
        return true;
    }

    function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.elective_contribution_strategy === "percentage_of_income" && (value === null || value === undefined)) {
            return new Error("Contribution Percentage is required when Percentage of Income Contribution strategy is selected");
        }
        return true;
    }

    function validateIncome(rule: FormItemRule, value: string | undefined) {
        if (modelRef.value.elective_contribution_strategy === TaxDeferredContributionStrategy.PercentageOfIncome && (value === null || value === undefined)) {
            return new Error("Income is required for Percentage of Income Contribution Strategy");
        }
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: 3, message: " name must be at least 3 characters long", trigger: ["blur", "change"]},
            {max: 32, message: " name must be at most 32 characters long", trigger: ["blur", "change"]}
        ],
        income: [
            {validator: validateIncome, trigger: ["blur", "change"]},
        ],
        growth_rate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Growth rate must be at least 0", trigger: ["blur", "change"]},
            {type: "number", max: 100, message: "Growth rate must be at most 100", trigger: ["blur", "change"]}
        ],
        initial_balance: [
            {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Balance must be at least 0", trigger: ["blur", "change"]}
        ],
        elective_contribution_strategy: [
            {required: true, message: "Elective contribution strategy is required", trigger: ["blur", "change"]}
        ],
        elective_contribution_percentage: [
            {validator: validateContributionPercentage, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: "Elective contribution percentage must be at least 0",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Elective contribution percentage must be at most 100",
                trigger: ["blur", "change"]
            }
        ],
        elective_contribution_fixed_amount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: "Elective contribution fixed amount must be at least 0",
                trigger: ["blur", "change"]
            }
        ],
        employer_contribution_strategy: [
            {required: true, message: "Employer contribution strategy is required", trigger: ["blur", "change"]}
        ],
        employer_contribution_match_percentage: [
            {
                required: true,
                type: "number",
                message: "Employer compensation match percentage is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Employer compensation match percentage must be at least 0",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Employer compensation match percentage must be at most 100",
                trigger: ["blur", "change"]
            }
        ],
        employer_contribution_fixed_amount: [
            {
                required: true,
                type: "number",
                message: "Employer contribution fixed amount is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Employer contribution fixed amount must be at least 0",
                trigger: ["blur", "change"]
            }
        ],
        employer_match_percentage: [
            {
                required: true,
                type: "number",
                message: "Employer match percentage is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Employer match percentage must be at least 0",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Employer match percentage must be at most 100",
                trigger: ["blur", "change"]
            }
        ],
        employer_match_percentage_limit: [
            {
                required: true,
                type: "number",
                message: "Employer match percentage limit is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Employer match percentage limit must be at least 0",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Employer match percentage limit must be at most 100",
                trigger: ["blur", "change"]
            }
        ]
    };

    return {rules};
}
