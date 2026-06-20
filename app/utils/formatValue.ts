import {format, parseISO} from 'date-fns';
import {FormatType} from "~/types/FormatType";

export function formatValue(value: string | number | Date, formatType: FormatType) {
    const numericValue = Number(value);

    switch (formatType) {
        case FormatType.Currency:
            return numericValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        case FormatType.Percentage:
            return `${(numericValue * 100).toFixed(2)}%`;

        case FormatType.Decimal:
            const precision = formatType.includes(':') ? parseInt(formatType.split(':')[1], 10) || 2 : 2;
            return numericValue.toFixed(precision);

        case FormatType.Scientific:
            return numericValue.toExponential(2);

        case FormatType.DateShort:
            return format(parseISO(value as string), 'MM/dd/yyyy');

        case FormatType.DateLong:
            return format(parseISO(value as string), 'MMMM d, yyyy');

        case FormatType.Number:
            return numericValue.toLocaleString('en-US');

        case FormatType.Time:
            return format(parseISO(value as string), 'hh:mm a');

        case FormatType.DateTime:
            return format(parseISO(value as string), 'MM/dd/yyyy hh:mm a');

        default:
            return value.toString();
    }
}