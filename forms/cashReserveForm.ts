import * as yup from "yup";
import {
    MAX_RESERVE_AMOUNT,
    MAX_RESERVE_MONTHS,
    MIN_RESERVE_AMOUNT,
    MIN_RESERVE_MONTHS
} from "~/models/cashReserve/CashReserveConstants";
import type {CashReservePartial, CashReserveStrategy} from "~/models/cashReserve/CashReserve";
import type {Field, NumberField, SelectField} from "~/interfaces/FieldData";
import {createSchema} from "~/utils/schemaUtils";


export const cashReserveForm: Record<keyof CashReservePartial, Field | SelectField | NumberField> = {
    name: {
        name: "name",
        label: "Name",
        placeholder: "Enter cashReserve maintenance name",
        helpText: "Provide a descriptive name for this cashReserve maintenance strategy.",
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
        rules: yup.number().min(0)
    },
    cashReserveStrategy: {
        name: "cashReserveStrategy",
        label: "Cash Reserve Strategy",
        placeholder: "Select cash Reserve strategy",
        helpText: "Choose the strategy for maintaining your cash Reserve.",
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
        rules: yup
            .number()
            .required("Reserve months is required")
            .min(MIN_RESERVE_MONTHS, `Reserve months must be at least ${MIN_RESERVE_MONTHS}.`)
            .max(MAX_RESERVE_MONTHS, `Reserve months cannot exceed ${MAX_RESERVE_MONTHS}.`),
    },
};


export const cashReserveFormSchema = createSchema(cashReserveForm)