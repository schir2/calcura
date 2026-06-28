import type {TaxDeferred} from "#shared/types/TaxDeferred";
import type {FormItemRule, FormRules} from "naive-ui";

export function taxDeferredRules(modelRef: Ref<Partial<TaxDeferred>>) {
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
        if (modelRef.value.elective_contribution_strategy === 'percentage_of_income' && (value === null || value === undefined)) {
            return new Error("Income is required for Percentage of Income Contribution Strategy");
        }
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: MIN_NAME_LENGTH, message: `Name must be at least ${MIN_NAME_LENGTH} characters long`, trigger: ["blur", "change"]},
            {max: MAX_NAME_LENGTH, message: `Name must be at most ${MAX_NAME_LENGTH} characters long`, trigger: ["blur", "change"]}
        ],
        income: [
            {validator: validateIncome, trigger: ["blur", "change"]},
        ],
        growth_rate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_GROWTH_RATE, message: `Growth rate must be at least ${MIN_GROWTH_RATE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_GROWTH_RATE, message: `Growth rate must be at most ${MAX_GROWTH_RATE}`, trigger: ["blur", "change"]}
        ],
        initial_balance: [
            {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Balance must be at least 0", trigger: ["blur", "change"]}
        ],
        elective_contribution_strategy: [
            {required: true, message: "Elective contribution strategy is required", trigger: ["blur", "change"]}
        ],
        elective_contribution_percentage: [
            {validator: validateContributionPercentage, trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Elective contribution percentage must be at least ${MIN_PERCENTAGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Elective contribution percentage must be at most ${MAX_PERCENTAGE}`, trigger: ["blur", "change"]}
        ],
        elective_contribution_fixed_amount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Elective contribution fixed amount must be at least 0", trigger: ["blur", "change"]}
        ],
        employer_contribution_strategy: [
            {required: true, message: "Employer contribution strategy is required", trigger: ["blur", "change"]}
        ],
        employer_compensation_match_percentage: [
            {required: true, type: "number", message: "Employer compensation match percentage is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Employer compensation match percentage must be at least ${MIN_PERCENTAGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Employer compensation match percentage must be at most ${MAX_PERCENTAGE}`, trigger: ["blur", "change"]}
        ],
        employer_contribution_fixed_amount: [
            {required: true, type: "number", message: "Employer contribution fixed amount is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Employer contribution fixed amount must be at least 0", trigger: ["blur", "change"]}
        ],
        employer_match_percentage: [
            {required: true, type: "number", message: "Employer match percentage is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Employer match percentage must be at least ${MIN_PERCENTAGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Employer match percentage must be at most ${MAX_PERCENTAGE}`, trigger: ["blur", "change"]}
        ],
        employer_match_percentage_limit: [
            {required: true, type: "number", message: "Employer match percentage limit is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Employer match percentage limit must be at least ${MIN_PERCENTAGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Employer match percentage limit must be at most ${MAX_PERCENTAGE}`, trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
