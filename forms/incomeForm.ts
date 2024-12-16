import * as yup from "yup";

import type {Income, IncomePartial} from "~/models/income/Income";
import {createSchema} from "~/utils/schemaUtils";
import type {FormData} from "~/interfaces/FieldData"

export const incomeForm: FormData<Income> = {
    name: {
        name: 'name',
        label: 'Income Name',
        placeholder: 'Enter income name',
        helpText: 'Enter a descriptive name for this income source.',
        rules: yup
            .string()
            .required('Name is required')
            .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters long.`)
            .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`),

    },
    frequency: {
        name: 'frequency',
        label: 'Frequency',
        placeholder: 'Enter income frequency',
        helpText: 'How often do you receive this income?',
        options: [
            {label: 'Weekly', value: 'weekly',},
            {label: 'Biweekly', value: 'biweekly',},
            {label: 'Monthly', value: 'monthly',},
            {label: 'Quarterly', value: 'quarterly',},
            {label: 'Annual', value: 'annual',},
        ]
    },
    grossIncome: {
        name: 'grossIncome',
        label: 'Gross Income',
        placeholder: 'Enter gross income amount',
        helpText: 'Total income amount before taxes and deductions.',
        rules: yup
            .number()
            .required('Gross income is required')
            .min(0, `Gross income must be at least $${0}.`),
    },
    growthRate: {
        name: 'growthRate',
        label: 'Growth Rate (%)',
        placeholder: 'Enter growth rate',
        helpText: 'Annual growth rate of this income source.',
        rules: yup
            .number()
            .required('Growth rate is required')
            .min(MIN_GROWTH_RATE, `Growth rate must be at least ${MIN_GROWTH_RATE}%.`)
            .max(MAX_GROWTH_RATE, `Growth rate must be at most ${MAX_GROWTH_RATE}%.`),
    },

    incomeType: {
        name: 'incomeType',
        label: 'Income Type',
        placeholder: 'Select income type',
        helpText: 'Select type to determine taxation rules.',
        options: [
            {label: 'Ordinary', value: 'ordinary'}
        ]
    }
}

export const incomeFormSchema = createSchema<IncomePartial>(incomeForm);