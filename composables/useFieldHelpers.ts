import type {FieldProps, FormData} from "~/interfaces/FieldData";

// TODO Fix Typing
export function useFieldHelpers<T>(
    formConfig: FormData<T>, // Ensure type safety with FormData
    defineField: any
) {
    const fieldHelpers: Record<string, { value: any; props: FieldProps }> = {};

    Object.keys(formConfig).forEach((key) => {
        const fieldName = key as keyof T;

        const naiveConfig = (state: { errors: string[] }) => ({
            props: {
                validationStatus: state.errors[0] ? "error" : undefined,
                feedback: state.errors[0],
            },
        });
        const [value, props] = defineField(fieldName as string, naiveConfig);
        fieldHelpers[fieldName as string] = {
            value: value,
            props: {
                ...props,
                label: formConfig[fieldName]?.label,
                placeholder: formConfig[fieldName]?.placeholder,
                helpText: formConfig[fieldName]?.helpText,
            }
        };
    });

    return fieldHelpers;
}
