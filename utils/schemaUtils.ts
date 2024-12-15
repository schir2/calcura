import * as yup from "yup";
import type { ObjectShape, AnySchema } from "yup";
import type { Field, NumberField, SelectField } from "~/interfaces/FieldData";

type FieldMap<T> = Record<keyof T, Field | NumberField | SelectField>;

/**
 * Creates a validation schema from a field map
 * @param fields - A map of fields with their validation rules
 * @returns A yup validation schema
 */
export function createSchema<T>(fields: FieldMap<T>): yup.ObjectSchema<ObjectShape> {
    const shape = Object.fromEntries(
        Object.entries(fields).flatMap(([key, field]) => {
            const typedField = field as Field | NumberField | SelectField;
            if (typedField.rules) {
                return [[key, typedField.rules as AnySchema]]; // Explicit cast to AnySchema
            }
            return [];
        })
    ) as ObjectShape;

    return yup.object(shape);
}
