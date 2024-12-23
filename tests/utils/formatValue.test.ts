import {describe, expect, it} from 'vitest';
import {formatValue} from '~/utils/formatValue';
import {FormatType} from '~/enums/FormatType';

describe('formatValue', () => {
    it('formats a number as currency', () => {
        const result = formatValue(1234.56, FormatType.Currency);
        expect(result).toBe('$1,234.56');
    });

    it('formats a number as a percentage', () => {
        const result = formatValue(0.1234, FormatType.Percentage);
        expect(result).toBe('12.34%');
    });

    it('formats a number with fixed decimal places', () => {
        const result = formatValue(1234.5678, FormatType.Decimal);
        expect(result).toBe('1234.57');
    });

    it('formats a number in scientific notation', () => {
        const result = formatValue(123456, FormatType.Scientific);
        expect(result).toBe('1.23e+5');
    });

    it('formats a number with commas as a plain number', () => {
        const result = formatValue(1234567, FormatType.Number);
        expect(result).toBe('1,234,567');
    });

    it('formats a date as a short string', () => {
        const result = formatValue('2024-12-25', FormatType.DateShort);
        expect(result).toBe('12/25/2024');
    });

    it('formats a date as a long string', () => {
        const result = formatValue('2024-12-25', FormatType.DateLong);
        expect(result).toBe('December 25, 2024');
    });
});
