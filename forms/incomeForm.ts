import * as yup from "yup";
import type {IncomeTaxStrategy} from '@/types'
import type {IncomeData} from "~/models/Income";
import type {FieldData} from "~/interfaces/FieldData";
import type {SelectOption} from "~/components/form/Select.vue";

import {DEFAULT_GROSS_INCOME, DEFAULT_GROWTH_RATE, DEFAULT_GROWTH_STRATEGY, DEFAULT_INCOME_NAME, DEFAULT_TAX_RATE, DEFAULT_TAX_STRATEGY, MAX_GROWTH_RATE, MAX_INCOME_NAME_LENGTH, MAX_TAX_RATE, MIN_GROSS_INCOME, MIN_GROWTH_RATE, MIN_INCOME_NAME_LENGTH, MIN_TAX_RATE,} from '~/constants/income';

export const taxStrategyOptions: Record<IncomeTaxStrategy, SelectOption> = {
    ordinaryIncome: {label: 'Ordinary Income Tax Rates', value: 'ordinaryIncome'},
    capitalGains: {label: 'Capital Gains Tax Rates', value: 'capitalGains'},
    taxExempt: {label: 'Tax-Exempt', value: 'taxExempt'},
    qualifiedDividends: {label: 'Qualified Dividends Tax Rates', value: 'qualifiedDividends'},
    selfEmploymentTax: {label: 'Self-Employment Tax', value: 'selfEmploymentTax'},
    simple: {label: 'Simple Flat Tax Rate', value: 'simple'}, // New simple strategy
};


export const incomeFields: FieldData<IncomeData>[] = [
    {
        key: 'name',
        name: 'name',
        value: DEFAULT_INCOME_NAME,
        label: 'Income Name',
        placeholder: 'Enter income name',
        helpText: 'Enter a descriptive name for this income source.',
        type: 'text',
        defaultValue: DEFAULT_INCOME_NAME,
        rules: yup
            .string()
            .required('Name is required')
            .min(MIN_INCOME_NAME_LENGTH, `Name must be at least ${MIN_INCOME_NAME_LENGTH} characters long.`)
            .max(MAX_INCOME_NAME_LENGTH, `Name must be at most ${MAX_INCOME_NAME_LENGTH} characters long.`),
    },
    {
        key: 'grossIncome',
        name: 'grossIncome',
        value: DEFAULT_GROSS_INCOME,
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
    {
        key: 'growthStrategy',
        name: 'growthStrategy',
        value: DEFAULT_GROWTH_STRATEGY,
        label: 'Growth Strategy',
        placeholder: 'Select growth strategy',
        helpText: 'Choose how this income will grow over time.',
        type: 'select',
        defaultValue: DEFAULT_GROWTH_STRATEGY,
        rules: yup.mixed().required('Growth strategy is required'),
        options: {
            fixed: {label: 'Fixed Amount', value: 'fixed'},
            percentage: {label: 'Percentage Growth', value: 'percentage'},
        },
    },
    {
        key: 'growthRate',
        name: 'growthRate',
        value: DEFAULT_GROWTH_RATE,
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
    {
        key: 'taxStrategy',
        name: 'taxStrategy',
        value: DEFAULT_TAX_STRATEGY,
        label: 'Tax Strategy',
        placeholder: 'Select tax strategy',
        helpText: 'Select how this income is taxed.',
        type: 'select',
        defaultValue: DEFAULT_TAX_STRATEGY,
        rules: yup.mixed().required('Tax strategy is required'),
        options: taxStrategyOptions,
    },
    {
        key: 'taxRate',
        name: 'taxRate',
        value: DEFAULT_TAX_RATE,
        label: 'Tax Rate (%)',
        placeholder: 'Enter effective tax rate',
        helpText: 'Enter the estimated effective tax rate for this income.',
        type: 'number',
        defaultValue: DEFAULT_TAX_RATE,
        rules: yup
            .number()
            .required('Tax rate is required when using the "Simple Flat Tax Rate" strategy.')
            .min(MIN_TAX_RATE, `Tax rate must be at least ${MIN_TAX_RATE}%.`)
            .max(MAX_TAX_RATE, `Tax rate must be at most ${MAX_TAX_RATE}%.`),
    },
];