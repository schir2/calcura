import type {FormItemRule, FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {CashReserve} from "~/types/CashReserve";
import {
    MAX_RESERVE_AMOUNT,
    MAX_RESERVE_MONTHS,
    MIN_RESERVE_AMOUNT,
    MIN_RESERVE_MONTHS
} from "~/constants/CashReserveConstants";

export function useCashReserveValidation(modelRef: Ref<Partial<CashReserve>>) {
    function validateReserveAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.cashReserveStrategy === "fixed") {
            if (value === null || value === undefined) {
                return new Error("Reserve amount is required when using a Fixed Cash Reserve strategy.");
            }
        }
        return true;
    }

    function validateReserveMonths(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.cashReserveStrategy === "variable") {
            if (value === null || value === undefined) {
                return new Error("Reserve months is required when using a Variable Cash Reserve strategy.");
            }
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Cash Reserve name is required", trigger: ["blur", "change"]},
            {min: 3, message: "Cash Reserve name must be at least 3 characters long.", trigger: ["blur", "change"]},
            {max: 100, message: "Cash Reserve name must be at most 100 characters long.", trigger: ["blur", "change"]}
        ],
        initialAmount: [
            {required: true, type: "number", message: "Initial amount is required", trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Initial amount must be at least $0.", trigger: ["blur", "change"]}
        ],
        cashReserveStrategy: [
            {required: true, message: "Cash Reserve strategy is required", trigger: ["blur", "change"]}
        ],
        reserveAmount: [
            {
                type: "number",
                min: MIN_RESERVE_AMOUNT,
                message: `Reserve amount must be at least $${MIN_RESERVE_AMOUNT}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RESERVE_AMOUNT,
                message: `Reserve amount cannot exceed $${MAX_RESERVE_AMOUNT}.`,
                trigger: ["blur", "change"]
            }
        ],
        reserveMonths: [
            {
                type: "number",
                min: MIN_RESERVE_MONTHS,
                message: `Reserve months must be at least ${MIN_RESERVE_MONTHS}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RESERVE_MONTHS,
                message: `Reserve months cannot exceed ${MAX_RESERVE_MONTHS}.`,
                trigger: ["blur", "change"]
            }
        ]
    };

    return {rules};
}
