import type {FormItemRule, FormRules} from "naive-ui";
import type {RothIra} from "~/types/RothIra";
import {RothIraContributionStrategy} from "~/types/RothIra";

export function useRothIraValidation(modelRef: Ref<Partial<RothIra>>) {

    function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.contribution_strategy === RothIraContributionStrategy.Fixed) {
            if (value === null || value === undefined) {
                return new Error("Fixed contribution amount is required when 'Fixed Payment' strategy is selected.");
            }
        }
        return true;
    }

    function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.contribution_strategy === RothIraContributionStrategy.PercentageOfIncome) {
            if (value === null || value === undefined) {
                return new Error("Contribution percentage is required when 'Percentage of Income' strategy is selected.");
            }
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: " name is required", trigger: ["blur", "change"]},
            {min: 3, message: " name must be at least 3 characters long.", trigger: ["blur", "change"]},
            {max: 32, message: " name must be at most 32 characters long.", trigger: ["blur", "change"]},
        ],
        growth_rate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Growth rate cannot be negative", trigger: ["blur", "change"]},
            {
                type: "number",
                max: 100,
                message: "Growth rate must be less than or equal to 100",
                trigger: ["blur", "change"]
            },
        ],
        initial_balance: [
            {required: true, type: "number", message: "Initial balance is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Initial balance cannot be negative", trigger: ["blur", "change"]},
        ],
        contribution_strategy: [
            {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]},
        ],
        contribution_percentage: [
            {validator: validateContributionPercentage, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: "Contribution percentage cannot be negative",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Contribution percentage must be at most 100",
                trigger: ["blur", "change"]
            },
        ],
        contribution_fixed_amount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: "Fixed contribution amount cannot be negative",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 8000,
                message: "Fixed contribution amount must be at most $8,000",
                trigger: ["blur", "change"]
            },
        ],
    };

    return {rules};
}
