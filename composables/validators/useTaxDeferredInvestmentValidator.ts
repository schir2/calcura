import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {FormItemRule, FormRules} from "naive-ui";

export function useTaxDeferredInvestmentValidator(modelRef: Ref<Partial<TaxDeferredInvestment>>) {
    function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.electiveContributionStrategy === "fixed" && (value === null || value === undefined)) {
            return new Error("Fixed contribution amount is required when Fixed Contribution strategy is selected");
        }
        return true;
    }

    function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.electiveContributionStrategy === "percentage_of_income" && (value === null || value === undefined)) {
            return new Error("Contribution Percentage is required when Percentage of Income Contribution strategy is selected");
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: 3, message: "Investment name must be at least 3 characters long", trigger: ["blur", "change"]},
            {max: 32, message: "Investment name must be at most 32 characters long", trigger: ["blur", "change"]}
        ],
        growthRate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Growth rate must be at least 0", trigger: ["blur", "change"]},
            {type: "number", max: 100, message: "Growth rate must be at most 100", trigger: ["blur", "change"]}
        ],
        balance: [
            {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Balance must be at least 0", trigger: ["blur", "change"]}
        ],
        electiveContributionStrategy: [
            {required: true, message: "Elective contribution strategy is required", trigger: ["blur", "change"]}
        ],
        electiveContributionPercentage: [
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
        electiveContributionAmount: [
            {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: "Elective contribution fixed amount must be at least 0",
                trigger: ["blur", "change"]
            }
        ],
        employerContributionStrategy: [
            {required: true, message: "Employer contribution strategy is required", trigger: ["blur", "change"]}
        ],
        employerCompensationMatchPercentage: [
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
        employerContributionFixedAmount: [
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
        employerMatchPercentage: [
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
        employerMatchPercentageLimit: [
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