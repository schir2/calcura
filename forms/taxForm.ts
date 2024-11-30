import * as yup from "yup"
import type {FieldData} from "~/interfaces/FieldData";
import {DEFAULT_TAX_STRATEGY} from "~/models/tax/TaxConstants";
import type TaxConfig from "~/models/tax/TaxConfig";

export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;

export const taxFields: Record<keyof TaxConfig, FieldData> = {
    taxStrategy: {
        name: 'taxStrategy',
        label: 'Tax Strategy',
        placeholder: 'Select tax strategy',
        helpText: 'Select how this income is taxed.',
        type: 'select',
        defaultValue: DEFAULT_TAX_STRATEGY,
        rules: yup.mixed().required('Tax strategy is required'),
        options: [
            {label: "Simple", value: 'simple'}
        ],
    },
    taxRate: {
        name: 'taxRate',
        label: 'Tax Rate (%)',
        placeholder: 'Enter tax rate',
        helpText: 'Effective tax rate for this income.',
        type: 'number',
        defaultValue: 0, // Defaulting to 0%
        rules: yup
            .number()
            .required('Tax rate is required')
            .min(MIN_TAX_RATE, 'Tax rate cannot be negative.')
            .max(MAX_TAX_RATE, 'Tax rate must be 100% or less.'),
    },

}