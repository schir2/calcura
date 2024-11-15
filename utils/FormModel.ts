import type { FieldData } from "~/interfaces/FieldData";

export default class formUtil<T extends object> {
    private fields: FieldData<T>[];
    private formData: { [K in keyof T]: FieldData<T[K]> };

    [key: string]: any;

    constructor(fields: FieldData<T>[]) {
        this.fields = fields;
        this.formData = {} as { [K in keyof T]: FieldData<T[K]> };

        fields.forEach((field) => {
            const key = field.key;
            field.name = key as string;
            field.value =
                field.defaultValue !== undefined
                    ? field.defaultValue
                    : this.getDefaultValue(field.type);

            this.formData[key] = field as FieldData<T[K]>;
            this[key as string] = field;
        });
    }

    initialize(data: Partial<T>): void {
        Object.keys(this.formData).forEach((key) => {
            if (key in data) {
                this.formData[key].value = data[key as keyof T]!;
            }
        });
    }

    private getDefaultValue(type?: string): any {
        switch (type) {
            case "number":
                return 0;
            case "checkbox":
                return false;
            case "select":
            case "text":
            default:
                return "";
        }
    }

    toObject(): T {
        return Object.keys(this.formData).reduce((data, key) => {
            data[key as keyof T] = this.formData[key].value;
            return data;
        }, {} as T);
    }
}
