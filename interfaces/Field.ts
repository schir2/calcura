import * as yup from "yup";
import type {SelectOption} from "~/components/form/Select.vue";

export interface Field<T = any> {
    key: keyof T;
    name: string;
    value?: T[keyof T];
    label: string;
    placeholder?: string;
    helpText?: string;
    resourceId?: string;
    rules?: yup.AnySchema;
    type?: "text" | "number" | "select" | "checkbox";
    readonly?: boolean;
    disabled?: boolean;
    defaultValue?: T[keyof T];
    options?:  Record<string, SelectOption>;
}
