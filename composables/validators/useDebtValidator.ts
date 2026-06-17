import type {FormItemRule, FormRules} from "naive-ui";
import type {Debt} from "~/types/Debt";
import {
    MAX_DEBT_NAME_LENGTH,
    MAX_INTEREST_RATE,
    MAX_PAYMENT,
    MIN_DEBT_NAME_LENGTH,
    MIN_INTEREST_RATE,
    MIN_PAYMENT
} from "~/constants/DebtConstants";

export function useDebtValidation(modelRef: Ref<Partial<Debt>>) {
    function validatePaymentFixedAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.payment_strategy === 'fixed') {
            if (value === null || value === undefined) {
                return new Error("Fixed payment amount is required when 'Fixed Payment' strategy is selected.");
            }
        }
        return true;
    }

    function validatePaymentPercentage(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.payment_strategy === 'percentage_of_debt') {
            if (value === null || value === undefined) {
                return new Error("Payment percentage is required when 'Percentage of Debt' strategy is selected.");
            }
        }
        return true;
    }

    function validatePaymentMinimum(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.payment_strategy === 'minimum_payment') {
            if (value === null || value === undefined) {
                return new Error("Fixed payment amount is required if Fixed Payment Strategy is selected")
            }
        }
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Debt name is required", trigger: ["blur", "change"]},
            {
                min: MIN_DEBT_NAME_LENGTH,
                message: `Debt name must be at least ${MIN_DEBT_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            },
            {
                max: MAX_DEBT_NAME_LENGTH,
                message: `Debt name must be at most ${MAX_DEBT_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            }
        ],
        principal: [
            {required: true, type: "number", message: "Principal amount is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_PAYMENT,
                message: `Principal amount must be at least $${MIN_PAYMENT}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_PAYMENT,
                message: `Principal amount cannot exceed $${MAX_PAYMENT}.`,
                trigger: ["blur", "change"]
            }
        ],
        interest_rate: [
            {required: true, type: "number", message: "Interest rate is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_INTEREST_RATE,
                message: `Interest rate must be at least ${MIN_INTEREST_RATE}%.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_INTEREST_RATE,
                message: `Interest rate must be at most ${MAX_INTEREST_RATE}%.`,
                trigger: ["blur", "change"]
            }
        ],
        payment_minimum: [
            {
                type: "number",
                min: MIN_PAYMENT,
                message: `Minimum payment must be at least $${MIN_PAYMENT}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_PAYMENT,
                message: `Minimum payment cannot exceed $${MAX_PAYMENT}.`,
                trigger: ["blur", "change"]
            },
            {
                validator: validatePaymentMinimum, trigger: ["blur", "change"],
            }
        ],
        payment_strategy: [
            {required: true, message: "Payment strategy is required", trigger: ["blur", "change"]}
        ],
        payment_fixed_amount: [
            {validator: validatePaymentFixedAmount, trigger: ["blur", "change"]},
            {
                type: "number",
                min: 0,
                message: `Fixed payment must be at least $${MIN_PAYMENT}.`,
                trigger: ["blur", "change"]
            },
        ],
        payment_percentage: [
            {validator: validatePaymentPercentage, trigger: ["blur", "change"]},
            {type: "number", min: 0, message: "Payment percentage must be at least 0%.", trigger: ["blur", "change"]},
            {type: "number", max: 100, message: "Payment percentage must not exceed 100%.", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
