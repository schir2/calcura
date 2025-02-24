import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {IraInvestment} from "~/types/IraInvestment";

export function useIraInvestmentValidation(modelRef: Ref<Partial<IraInvestment>>) {
    const rules: FormRules = {
        name: [
            {required: true, message: "Investment name is required", trigger: ["blur", "change"]},
            {min: 3, message: "Investment name must be at least 3 characters long.", trigger: ["blur", "change"]},
            {max: 32, message: "Investment name must be at most 32 characters long.", trigger: ["blur", "change"]}
        ],
        growthRate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Growth rate must be at least 0%", trigger: ["blur", "change"]},
            {type: "number", max: 100, message: "Growth rate must be at most 100%", trigger: ["blur", "change"]}
        ],
        initialBalance: [
            {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Balance must be at least $0.", trigger: ["blur", "change"]}
        ],
        contributionStrategy: [
            {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]}
        ],
        contributionPercentage: [
            {
                required: true,
                type: "number",
                message: "Elective contribution percentage is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Elective contribution percentage must be at least 0%",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: 100,
                message: "Elective contribution percentage must be at most 100%",
                trigger: ["blur", "change"]
            }
        ],
        contributionFixedAmount: [
            {
                required: true,
                type: "number",
                message: "Elective contribution fixed amount is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: 0,
                message: "Elective contribution fixed amount must be at least $0.",
                trigger: ["blur", "change"]
            }
        ]
    };

    return {rules};
}
