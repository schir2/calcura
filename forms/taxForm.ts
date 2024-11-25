import * as yup from "yup"
import type {TaxData} from "~/models/tax/TaxConfig"
import type { FieldData } from "~/interfaces/FieldData";
import {DEFAULT_TAX_STRATEGY} from "~/models/tax/TaxConstants";
import {IncomeTaxStrategy} from "~/models/tax/TaxConfig";

export const taxFields: Record<keyof TaxData, FieldData> = {
    taxStrategy: {
        name: 'taxStrategy',
        label: 'Tax Strategy',
        placeholder: 'Select tax strategy',
        helpText: 'Select how this income is taxed.',
        type: 'select',
        defaultValue: DEFAULT_TAX_STRATEGY,
        rules: yup.mixed().required('Tax strategy is required'),
        options: [
            {label: "Simple", value: IncomeTaxStrategy.Simple}
        ],
    }
}