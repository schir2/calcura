import type {FormItemRule, FormRules} from "naive-ui";
import type {HsaPartial} from "~/types/Hsa";

export function useHsaValidator(modelRef: Ref<HsaPartial>) {
    function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.contributionStrategy === "fixed") {
            if (value === null || value === undefined) {
                return new Error("Fixed contribution amount is required when Fixed Contribution strategy is selected");
            }
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: 3, message: " name must be at least 3 characters long", trigger: ["blur", "change"]},
            {max: 50, message: " name must be at most 50 characters long", trigger: ["blur", "change"]}
        ],
        growthRate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Growth rate cannot be negative", trigger: ["blur", "change"]},
            {
                type: "number",
                max: 100,
                message: "Growth rate must be less than or equal to 100",
                trigger: ["blur", "change"]
            }
        ],
        initialBalance: [
            {required: true, type: "number", message: "Initial balance is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Initial balance cannot be negative", trigger: ["blur", "change"]}
        ],
        contributionStrategy: [
            {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]}
        ],
        contributionPercentage: [
            {
                type: "number",
                min: 0,
                message: "Contribution percentage cannot be negative",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Contribution percentage must be less than or equal to 100",
                trigger: ["blur", "change"]
            }
        ],
        contributionFixedAmount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {type: "number", message: "Fixed contribution amount is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Contribution amount cannot be negative", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
