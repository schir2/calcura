import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {Ira} from "#shared/types/Ira";

export function useIraValidation(modelRef: Ref<Partial<Ira>>) {
    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {min: MIN_NAME_LENGTH, message: `Name must be at least ${MIN_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]},
            {max: MAX_NAME_LENGTH, message: `Name must be at most ${MAX_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]}
        ],
        growth_rate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_GROWTH_RATE, message: `Growth rate must be at least ${MIN_GROWTH_RATE}%`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_GROWTH_RATE, message: `Growth rate must be at most ${MAX_GROWTH_RATE}%`, trigger: ["blur", "change"]}
        ],
        initial_balance: [
            {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Balance must be at least $0.", trigger: ["blur", "change"]}
        ],
        contribution_strategy: [
            {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]}
        ],
        contribution_percentage: [
            {required: true, type: "number", message: "Elective contribution percentage is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_PERCENTAGE, message: `Elective contribution percentage must be at least ${MIN_PERCENTAGE}%`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_PERCENTAGE, message: `Elective contribution percentage must be at most ${MAX_PERCENTAGE}%`, trigger: ["blur", "change"]}
        ],
        contribution_fixed_amount: [
            {required: true, type: "number", message: "Elective contribution fixed amount is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Elective contribution fixed amount must be at least $0.", trigger: ["blur", "change"]},
            {type: "number", max: IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024, message: `Elective contribution fixed amount must be at most $${IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024}.`, trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
