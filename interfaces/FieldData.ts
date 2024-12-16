import * as yup from "yup";
import type {SelectOption} from "~/components/form/BaseSelect.vue";

export interface Option {
    label: string;
    value: string;
}

export interface Field<T = any> {
    name: string;
    label: string;
    placeholder?: string;
    helpText?: string;
    resourceId?: string;
    rules?: yup.AnySchema;

}

export interface NumberField extends Field{
    min?: number;
    max?: number;
}

export interface SelectField extends Field{
    options: Option[];
}

export type FormData<T> = Record<keyof Partial<Omit<T, 'id'>>, Field | SelectField | NumberField>;