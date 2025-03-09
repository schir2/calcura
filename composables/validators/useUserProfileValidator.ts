import type {FormItemRule, FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {CashReserve} from "~/types/CashReserve";
import {
    MAX_RESERVE_AMOUNT,
    MAX_RESERVE_MONTHS,
    MIN_RESERVE_AMOUNT,
    MIN_RESERVE_MONTHS
} from "~/constants/CashReserveConstants";

export function useUserProfileValidation(modelRef: Ref<Partial<CashReserve>>) {
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
    };

    return {rules};
}
