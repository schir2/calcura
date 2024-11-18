import { describe, it, expect, beforeEach } from 'vitest';
import { debtPipelineByName } from '~/models/pipelines/debtPipelineByName';
import Row from '~/models/Row';
import Debt from '~/models/Debt';

describe('Debt Pipeline by Name Tests', () => {
    let row: Row;

    beforeEach(() => {
        row = {
            incomeDisposable: 1000,
            debts: [
                new Debt({
                    name: 'Car Loan',
                    principal: 5000,
                    interestRate: 5,
                    paymentMinimum: 200,
                    paymentStrategy: 'fixed',
                    paymentFixedAmount: 300,
                    paymentPercentage: 0,
                }),
                new Debt({
                    name: 'Student Loan',
                    principal: 10000,
                    interestRate: 3,
                    paymentMinimum: 150,
                    paymentStrategy: 'max',
                    paymentFixedAmount: 0,
                    paymentPercentage: 0,
                }),
            ],
        } as unknown as Row; // Mocking Row with minimal data needed for the tests
    });

    it('should process the correct debt by name and update row', () => {
        const updatedRow = debtPipelineByName(row, 'Car Loan');

        const carLoan = updatedRow.debts.find((d) => d.name === 'Car Loan');
        expect(carLoan?.payment).toBe(300);
        expect(carLoan?.principalEndOfYear).toBeCloseTo(4935, 2); // Principal reduced by payment with interest applied
        expect(updatedRow.incomeDisposable).toBe(700); // Disposable income reduced by payment
    });

    it('should handle the "max" payment strategy correctly', () => {
        const updatedRow = debtPipelineByName(row, 'Student Loan');

        const studentLoan = updatedRow.debts.find((d) => d.name === 'Student Loan');
        expect(studentLoan?.payment).toBe(1000); // Entire disposable income is used
        expect(studentLoan?.principalEndOfYear).toBeCloseTo(9000 + (9000 * 0.03), 2); // Principal reduced by payment, interest added
        expect(updatedRow.incomeDisposable).toBe(0); // All disposable income used
    });

    it('should not update row if debt name is not found', () => {
        const updatedRow = debtPipelineByName(row, 'Nonexistent Debt');

        expect(updatedRow).toEqual(row); // Row should remain unchanged
        expect(updatedRow.incomeDisposable).toBe(1000);
    });

    it('should handle zero disposable income gracefully', () => {
        row.incomeDisposable = 0;
        const updatedRow = debtPipelineByName(row, 'Car Loan');

        const carLoan = updatedRow.debts.find((d) => d.name === 'Car Loan');
        expect(carLoan?.payment).toBe(0); // Minimum payment still applies
        expect(carLoan?.principalEndOfYear).toBeCloseTo(5250, 2); // Principal reduced by minimum payment
        expect(updatedRow.incomeDisposable).toBe(0);
    });

    it('should handle partially paid debts correctly', () => {
        row.debts[0].principalStartOfYear = 100; // Car loan almost paid off
        const updatedRow = debtPipelineByName(row, 'Car Loan');

        const carLoan = updatedRow.debts.find((d) => d.name === 'Car Loan');
        expect(carLoan?.payment).toBe(100); // Only remaining principal is paid
        expect(carLoan?.principalEndOfYear).toBeCloseTo(0, 2); // Principal fully paid off
        expect(updatedRow.incomeDisposable).toBe(900); // Remaining disposable income
    });

    it('should handle zero principal gracefully', () => {
        row.debts[0].principalStartOfYear = 0; // Car loan already paid off
        const updatedRow = debtPipelineByName(row, 'Car Loan');

        const carLoan = updatedRow.debts.find((d) => d.name === 'Car Loan');
        expect(carLoan?.payment).toBe(0); // No payment needed
        expect(carLoan?.principalEndOfYear).toBe(0); // Principal remains zero
        expect(updatedRow.incomeDisposable).toBe(1000); // Disposable income remains unchanged
    });
});
