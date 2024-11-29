import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";
import {DEFAULT_CASH_MAINTENANCE_NAME, DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT, DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS, DEFAULT_CASH_MAINTENANCE_STRATEGY, MAX_RESERVE_AMOUNT, MAX_RESERVE_MONTHS, MIN_RESERVE_AMOUNT, MIN_RESERVE_MONTHS} from "~/models/cash/CashConstants";
import type {CashConfig, CashMaintenanceStrategy} from "~/models/cash/CashConfig";
import type {SelectOption} from "~/components/form/Select.vue";

export const cashMaintenanceStrategyOptions: Record<CashMaintenanceStrategy, SelectOption> = {
    fixedCashReserve: { label: "Fixed Cash Reserve", value: "fixedCashReserve" },
    variableCashReserve: { label: "Variable Cash Reserve", value: "variableCashReserve" },
};

export const cashMaintenanceFields: Record<keyof CashData, FieldData> = {
    name: {
        name: "name",
        label: "Name",
        placeholder: "Enter cash maintenance name",
        helpText: "Provide a descriptive name for this cash maintenance strategy.",
        type: "text",
        defaultValue: DEFAULT_CASH_MAINTENANCE_NAME,
        rules: yup
            .string()
            .required("Cash maintenance name is required")
            .min(3, "Cash maintenance name must be at least 3 characters long.")
            .max(100, "Cash maintenance name must be at most 100 characters long."),
    },
    cashMaintenanceStrategy: {
        name: "cashMaintenanceStrategy",
        label: "Cash Maintenance Strategy",
        placeholder: "Select cash maintenance strategy",
        helpText: "Choose the strategy for maintaining your cash reserve.",
        type: "select",
        defaultValue: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        rules: yup.mixed<CashMaintenanceStrategy>().required("Cash maintenance strategy is required"),
        options: cashMaintenanceStrategyOptions,
    },
    reserveAmount: {
        name: "reserveAmount",
        label: "Reserve Amount",
        placeholder: "Enter reserve amount",
        helpText: "Specify the amount of cash to reserve if using a fixed strategy.",
        type: "number",
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
        type: "number",
        defaultValue: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
        rules: yup
            .number()
            .required("Reserve months is required")
            .min(MIN_RESERVE_MONTHS, `Reserve months must be at least ${MIN_RESERVE_MONTHS}.`)
            .max(MAX_RESERVE_MONTHS, `Reserve months cannot exceed ${MAX_RESERVE_MONTHS}.`),
    },
};
