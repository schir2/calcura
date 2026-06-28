import type {FormItemRule, FormRules} from "naive-ui";
import type {Hsa} from "#shared/types/Hsa";

export function useHsaValidator(modelRef: Ref<Partial<Hsa>>) {
    function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.contribution_strategy === "fixed" && (value === null || value === undefined)) {
            return new Error("Fixed contribution amount is required when Fixed Contribution strategy is selected");
        }
        return true;
    }

    function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.contribution_strategy === "percentage_of_income" && (value === null || value === undefined)) {
            return new Error("Contribution Percentage is required when Percentage of Income Contribution strategy is selected");
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: MIN_NAME_LENGTH, message: `Name must be at least ${MIN_NAME_LENGTH} characters long`, trigger: ["blur", "change"]},
            {max: MAX_NAME_LENGTH, message: `Name must be at most ${MAX_NAME_LENGTH} characters long`, trigger: ["blur", "change"]}
        ],
        growth_rate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_GROWTH_RATE, message: `Growth rate must be at least ${MIN_GROWTH_RATE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_GROWTH_RATE, message: `Growth rate must be at most ${MAX_GROWTH_RATE}`, trigger: ["blur", "change"]}
        ],
        initial_balance: [
            {required: true, type: "number", message: "Initial balance is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Initial balance cannot be negative", trigger: ["blur", "change"]}
        ],
        contribution_strategy: [
            {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]}
        ],
        contribution_percentage: [
            {validator: validateContributionPercentage, trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Contribution percentage must be at least ${MIN_PERCENTAGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Contribution percentage must be at most ${MAX_PERCENTAGE}`, trigger: ["blur", "change"]}
        ],
        contribution_fixed_amount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Contribution amount cannot be negative", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
