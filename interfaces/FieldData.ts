import * as yup from "yup";
import type {SelectOption} from "~/components/form/BaseSelect.vue";

export interface Option {
    label: string;
    value: string;
}

export interface FieldData<T = any> {
    name: string;
    label: string;
    placeholder?: string;
    helpText?: string;
    resourceId?: string;
    rules?: yup.AnySchema;
    inputType?: "text" | "email" | "password" | "textArea";
    readonly?: boolean;
    disabled?: boolean;
    defaultValue?: T[keyof T];
    options?: Record<string, SelectOption> | Option[];
}

export interface Field<T = any> {
    name: string;
    label: string;
    placeholder?: string;
    helpText?: string;
    resourceId?: string;
    rules?: yup.AnySchema;
    readonly?: boolean;
    disabled?: boolean;
    defaultValue?: T[keyof T];
    clearable?: boolean;

}

export interface NumberField extends Field{
    min?: number;
    max?: number;
    precision?: number;
    step?: number;
}

export interface TextField extends Field{
    inputType?: "text" | "email" | "password" | "textArea";
}

export interface SelectField extends Field{
    options?: Option[];
}