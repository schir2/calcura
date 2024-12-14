import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import {DEFAULT_DEBT_NAME, DEFAULT_FIXED_PAYMENT, DEFAULT_INTEREST_RATE, DEFAULT_MINIMUM_PAYMENT, DEFAULT_PAYMENT_PERCENTAGE, DEFAULT_PAYMENT_STRATEGY, MAX_DEBT_NAME_LENGTH, MAX_INTEREST_RATE, MAX_PAYMENT, MIN_DEBT_NAME_LENGTH, MIN_INTEREST_RATE, MIN_PAYMENT,} from "~/models/debt/DebtConstants";
import type {DebtPartial} from "~/models/debt/Debt";

export const debtFields: Record<keyof DebtPartial, FieldData> = {
    name: {
        name: "name",
        label: "Debt Name",
        placeholder: "Enter debt name",
        helpText: "Provide a descriptive name for this debt.",
        inputType: "text",
        defaultValue: DEFAULT_DEBT_NAME,
        rules: yup
            .string()
            .required("Debt name is required")
            .min(MIN_DEBT_NAME_LENGTH, `Debt name must be at least ${MIN_DEBT_NAME_LENGTH} characters long.`)
            .max(MAX_DEBT_NAME_LENGTH, `Debt name must be at most ${MAX_DEBT_NAME_LENGTH} characters long.`),
    },
    principal: {
        name: "principal",
        label: "Principal Amount",
        placeholder: "Enter principal amount",
        helpText: "The total starting amount of the debt.",
        inputType: "number",
        defaultValue: 0, // You can define a `DEFAULT_PRINCIPAL` in constants if needed
        rules: yup
            .number()
            .required("Principal amount is required")
            .min(MIN_PAYMENT, `Principal amount must be at least $${MIN_PAYMENT}.`)
            .max(MAX_PAYMENT, `Principal amount cannot exceed $${MAX_PAYMENT}.`),
    },
    interestRate: {
        name: "interestRate",
        label: "Interest Rate (%)",
        placeholder: "Enter interest rate",
        helpText: "Annual interest rate for this debt.",
        inputType: "number",
        defaultValue: DEFAULT_INTEREST_RATE,
        rules: yup
            .number()
            .required("Interest rate is required")
            .min(MIN_INTEREST_RATE, `Interest rate must be at least ${MIN_INTEREST_RATE}%.`)
            .max(MAX_INTEREST_RATE, `Interest rate must be at most ${MAX_INTEREST_RATE}%.`),
    },
    paymentMinimum: {
        name: "paymentMinimum",
        label: "Minimum Payment",
        placeholder: "Enter minimum payment",
        helpText: "Specify the minimum monthly payment for this debt.",
        inputType: "number",
        defaultValue: DEFAULT_MINIMUM_PAYMENT,
        rules: yup
            .number()
            .required("Minimum payment is required")
            .min(MIN_PAYMENT, `Minimum payment must be at least $${MIN_PAYMENT}.`)
            .max(MAX_PAYMENT, `Minimum payment cannot exceed $${MAX_PAYMENT}.`),
    },
    paymentStrategy: {
        name: "paymentStrategy",
        label: "Payment Strategy",
        placeholder: "Select payment strategy",
        helpText: "Choose how payments for this debt will be calculated.",
        inputType: "select",
        defaultValue: DEFAULT_PAYMENT_STRATEGY,
        rules: yup.mixed().required("Payment strategy is required"),
        options: [
            {label: "Fixed Payment", value: "fixed"},
            {label: "Percentage of Debt", value: "percentage_of_debt"},
            {label: "Pay Maximum", value: "max"}],
    },
    paymentFixedAmount: {
        name: "paymentFixedAmount",
        label: "Fixed Payment Amount",
        placeholder: "Enter fixed payment amount",
        helpText: "Specify the fixed payment amount if 'Fixed Payment' strategy is selected.",
        inputType: "number",
        defaultValue: DEFAULT_FIXED_PAYMENT,
        rules: yup
            .number()
            .min(MIN_PAYMENT, `Fixed payment must be at least $${MIN_PAYMENT}.`)
            .max(MAX_PAYMENT, `Fixed payment cannot exceed $${MAX_PAYMENT}.`)
    },
    paymentPercentage: {
        name: "paymentPercentage",
        label: "Payment Percentage",
        placeholder: "Enter payment percentage",
        helpText: "Percentage of the total debt to be paid each month.",
        inputType: "number",
        defaultValue: DEFAULT_PAYMENT_PERCENTAGE,
        rules: yup
            .number()
            .min(0, "Payment percentage must be at least 0%.")
            .max(100, "Payment percentage must not exceed 100%.")

    },
};