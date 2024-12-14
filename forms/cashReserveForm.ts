import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import {
    DEFAULT_CASH_MAINTENANCE_NAME,
    DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
    DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
    DEFAULT_CASH_MAINTENANCE_STRATEGY,
    MAX_RESERVE_AMOUNT,
    MAX_RESERVE_MONTHS,
    MIN_RESERVE_AMOUNT,
    MIN_RESERVE_MONTHS
} from "~/models/cashReserve/CashReserveConstants";
import type {CashReservePartial, CashReserveStrategy} from "~/models/cashReserve/CashReserve";


export const cashReserveFields: Record<keyof CashReservePartial, FieldData> = {
    name: {
        name: "name",
        label: "Name",
        placeholder: "Enter cashReserve maintenance name",
        helpText: "Provide a descriptive name for this cashReserve maintenance strategy.",
        inputType: "text",
        defaultValue: DEFAULT_CASH_MAINTENANCE_NAME,
        rules: yup
            .string()
            .required("CashReserve maintenance name is required")
            .min(3, "CashReserve maintenance name must be at least 3 characters long.")
            .max(100, "CashReserve maintenance name must be at most 100 characters long."),
    },
    initialAmount: {
        name: 'initialAmount',
        label: "Initial Amount",
        placeholder: "Enter the amount currently in your cash reserve",
        helpText: "Enter a number greater than 0",
        inputType: "number",
        defaultValue: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        rules: yup.number().min(0)
    },
    cashReserveStrategy: {
        name: "cashReserveStrategy",
        label: "Cash Reserve Strategy",
        placeholder: "Select cash Reserve strategy",
        helpText: "Choose the strategy for maintaining your cash Reserve.",
        inputType: "select",
        defaultValue: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        rules: yup.mixed<CashReserveStrategy>().required("CashReserve maintenance strategy is required"),
        options: [
            {label: "Fixed Cash Reserve", value: "fixed"},
            {label: "Variable Cash Reserve", value: "variable"},
        ],
    },
    reserveAmount: {
        name: "reserveAmount",
        label: "Reserve Amount",
        placeholder: "Enter reserve amount",
        helpText: "Specify the amount of cashReserve to reserve if using a fixed strategy.",
        inputType: "number",
        defaultValue: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        rules: yup
            .number()
            .required("Reserve amount is required")
            .min(MIN_RESERVE_AMOUNT, `Reserve amount must be at least $${MIN_RESERVE_AMOUNT}.`)
            .max(MAX_RESERVE_AMOUNT, `Reserve amount cannot exceed $${MAX_RESERVE_AMOUNT}.`),
    },
    reserveMonths: {
        name: "reserveMonths",
        label: "Reserve Months",
        placeholder: "Enter reserve months",
        helpText: "Specify the number of months of expenses to reserve if using a variable strategy.",
        inputType: "number",
        defaultValue: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
        rules: yup
            .number()
            .required("Reserve months is required")
            .min(MIN_RESERVE_MONTHS, `Reserve months must be at least ${MIN_RESERVE_MONTHS}.`)
            .max(MAX_RESERVE_MONTHS, `Reserve months cannot exceed ${MAX_RESERVE_MONTHS}.`),
    },
};
