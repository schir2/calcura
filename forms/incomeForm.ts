import * as yup from "yup";
import type {FieldData} from "~/interfaces/FieldData";

import {
    DEFAULT_GROSS_INCOME,
    DEFAULT_GROWTH_RATE,
    DEFAULT_INCOME_FREQUENCY,
    DEFAULT_INCOME_NAME,
    MAX_GROWTH_RATE,
    MAX_NAME_LENGTH,
    MIN_GROSS_INCOME,
    MIN_GROWTH_RATE,
    MIN_NAME_LENGTH,
} from '~/models/income/IncomeConstants';
import type {Income} from "~/models/income/Income";

export const incomeFields: Record<keyof Income, FieldData> = {
    name: {
        name: 'name',
        label: 'Income Name',
        placeholder: 'Enter income name',
        helpText: 'Enter a descriptive name for this income source.',
        type: 'text',
        defaultValue: DEFAULT_INCOME_NAME,
        rules: yup
            .string()
            .required('Name is required')
            .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters long.`)
            .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`),
    },
    frequency: {
        name:'frequency',
        label: 'Frequency',
        placeholder: 'Enter income frequency',
        helpText:'How often do you receive this income?',
        type: 'text',
        defaultValue: DEFAULT_INCOME_FREQUENCY,
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
        type: 'number',
        defaultValue: DEFAULT_GROSS_INCOME,
        rules: yup
            .number()
            .required('Gross income is required')
            .min(MIN_GROSS_INCOME, `Gross income must be at least $${MIN_GROSS_INCOME}.`),
    },
    growthRate: {
        name: 'growthRate',
        label: 'Growth Rate (%)',
        placeholder: 'Enter growth rate',
        helpText: 'Annual growth rate of this income source.',
        type: 'number',
        defaultValue: DEFAULT_GROWTH_RATE,
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
        type: 'select',
        defaultValue: DEFAULT_INCOME_NAME,
        options: [
            {label: 'Ordinary', value: 'ordinary'}
        ]
    }
}