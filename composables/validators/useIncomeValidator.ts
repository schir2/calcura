import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {Income} from "~/types/Income";

export function useIncomeValidation(modelRef: Ref<Partial<Income>>) {
    const rules: FormRules = {
        name: [
            {required: true, message: "Income name is required", trigger: ["blur", "change"]},
            {
                min: MIN_NAME_LENGTH,
                message: `Name must be at least ${MIN_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            },
            {
                max: MAX_NAME_LENGTH,
                message: `Name must be at most ${MAX_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            }
        ],
        frequency: [
            {required: true, message: "Frequency is required", trigger: ["blur", "change"]}
        ],
        grossIncome: [
            {required: true, type: "number", message: "Gross income is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Gross income must be at least $0.", trigger: ["blur", "change"]}
        ],
        growthRate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_GROWTH_RATE,
                message: `Growth rate must be at least ${MIN_GROWTH_RATE}%.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_GROWTH_RATE,
                message: `Growth rate must be at most ${MAX_GROWTH_RATE}%.`,
                trigger: ["blur", "change"]
            }
        ],
        incomeType: [
            {required: true, message: "Income type is required", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
