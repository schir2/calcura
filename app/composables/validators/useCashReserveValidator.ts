import type {FormItemRule, FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {CashReserve} from "#shared/types/CashReserve";

export function useCashReserveValidation(modelRef: Ref<Partial<CashReserve>>) {
    function validateReserveAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.cash_reserve_strategy === "fixed") {
            if (value === null || value === undefined) {
                return new Error("Reserve amount is required when using a Fixed Cash Reserve strategy.");
            }
        }
        return true;
    }

    function validateReserveMonths(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.cash_reserve_strategy === "variable") {
            if (value === null || value === undefined) {
                return new Error("Reserve months is required when using a Variable Cash Reserve strategy.");
            }
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Cash Reserve name is required", trigger: ["blur", "change"]},
            {min: MIN_NAME_LENGTH, message: `Cash Reserve name must be at least ${MIN_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]},
            {max: MAX_NAME_LENGTH, message: `Cash Reserve name must be at most ${MAX_NAME_LENGTH} characters long.`, trigger: ["blur", "change"]}
        ],
        initial_amount: [
            {required: true, type: "number", message: "Initial amount is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_BALANCE, message: "Initial amount must be at least $0.", trigger: ["blur", "change"]}
        ],
        cash_reserve_strategy: [
            {required: true, message: "Cash Reserve strategy is required", trigger: ["blur", "change"]}
        ],
        reserve_amount: [
            {validator: validateReserveAmount, trigger: ["blur", "change"]},
            {type: "number", min: MIN_RESERVE_AMOUNT, message: `Reserve amount must be at least $${MIN_RESERVE_AMOUNT}.`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_RESERVE_AMOUNT, message: `Reserve amount cannot exceed $${MAX_RESERVE_AMOUNT}.`, trigger: ["blur", "change"]}
        ],
        reserve_months: [
            {validator: validateReserveMonths, trigger: ["blur", "change"]},
            {type: "number", min: MIN_RESERVE_MONTHS, message: `Reserve months must be at least ${MIN_RESERVE_MONTHS}.`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_RESERVE_MONTHS, message: `Reserve months cannot exceed ${MAX_RESERVE_MONTHS}.`, trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
