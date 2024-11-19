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
    type?: "text" | "number" | "select" | "checkbox";
    readonly?: boolean;
    disabled?: boolean;
    defaultValue?: T[keyof T];
    options?: Record<string, SelectOption> | Option[];
}