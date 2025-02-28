import {format, parseISO} from 'date-fns';
import type {FormatType} from "~/types/FormatType";

export function formatValue(value: string | number, formatType: FormatType) {
    const numericValue = Number(value);

    if (formatType === 'currency') {
        return numericValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    } else if (formatType === 'percentage') {
        return `${(numericValue * 100).toFixed(2)}%`;
    } else if (formatType.startsWith('decimal')) {
        const precision = parseInt(formatType.split(':')[1], 10) || 2;
        return numericValue.toFixed(precision);
    } else if (formatType === 'scientific') {
        return numericValue.toExponential(2);
    } else if (formatType === 'date') {
        const date = parseISO(value as string);
        return format(date, 'MM/dd/yyyy');
    } else if (formatType === 'date:long') {
        const date = parseISO(value as string);
        return format(date, 'MMMM d, yyyy');
    } else if (formatType === 'number') {
        return numericValue.toLocaleString('en-US');
    }

    return value.toString();
}
