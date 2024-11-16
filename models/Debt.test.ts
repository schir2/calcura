import {describe, expect, it, beforeEach} from 'vitest'
import Debt from '~/models/Debt';
import type { DebtData } from '~/interfaces/DebtData';

describe('Debt Class Tests', () => {
    let debtData: DebtData;

    beforeEach(() => {
        debtData = {
            name: 'Car Loan',
            principal: 10000,
            interestRate: 5,
            minimumPayment: 200,
            paymentStrategy: 'fixed',
            paymentFixedAmount: 500,
            paymentPercentage: 0,
        };
    });

    describe('Constructor', () => {
        it('should initialize Debt object with provided data', () => {
            const debt = new Debt(debtData);

            expect(debt.name).toBe('Car Loan');
            expect(debt.principalStartOfYear).toBe(10000);
            expect(debt.interestRate).toBe(5);
            expect(debt.paymentMinimum).toBe(200);
            expect(debt.paymentStrategy).toBe('fixed');
            expect(debt.paymentFixedAmount).toBe(500);
            expect(debt.principalEndOfYear).toBe(10000);
        });
    });

    describe('calculateEndOfYearValues', () => {
        it('should calculate end-of-year values correctly', () => {
            const debt = new Debt(debtData);
            debt.payment = 500;

            const { principalEndOfYear, interestAmount, interestAccrued, paymentLifetime } = debt.calculateEndOfYearValues();

            expect(principalEndOfYear).toBeCloseTo(9500 + (9500 * 0.05), 2);
            expect(interestAmount).toBeCloseTo(9500 * 0.05, 2);
            expect(interestAccrued).toBeCloseTo(9500 * 0.05, 2);
            expect(paymentLifetime).toBe(500);
        });
    });

    describe('calculatePayment', () => {
        it('should calculate payment correctly for fixed strategy', () => {
            const debt = new Debt(debtData);

            expect(debt.calculatePayment(400)).toBe(400);
            expect(debt.calculatePayment(600)).toBe(500);
            expect(debt.calculatePayment(100)).toBe(100);
        });

        it('should calculate payment correctly for percentage_of_debt strategy', () => {
            debtData.paymentStrategy = 'percentage_of_debt';
            debtData.paymentFixedAmount = 10;
            const debt = new Debt(debtData);

            expect(debt.calculatePayment(2000)).toBe(1000);
            expect(debt.calculatePayment(900)).toBe(900);
            expect(debt.calculatePayment(100)).toBe(100);
        });


        it('should calculate payment correctly for max strategy', () => {
            debtData.paymentStrategy = 'max';
            const debt = new Debt(debtData);

            expect(debt.calculatePayment(2000)).toBe(2000);
            expect(debt.calculatePayment(900)).toBe(900);
            expect(debt.calculatePayment(100)).toBe(100);
        });


    });

    describe('advanceToNextYear', () => {
        it('should advance to next year and reset payment', () => {
            const debt = new Debt(debtData);
            debt.principalEndOfYear = 9500;
            debt.payment = 500;

            const nextYearDebt = debt.advanceToNextYear();

            expect(nextYearDebt.principalStartOfYear).toBe(9500);
            expect(nextYearDebt.payment).toBe(0);
            expect(nextYearDebt).not.toBe(debt); // Ensure it's a new object
        });
    });

    describe('Edge Cases', () => {
        it('should handle 0 disposable income gracefully', () => {
            const debt = new Debt(debtData);

            expect(debt.calculatePayment(0)).toBe(0); // Minimum payment
        });

        it('should handle fully paid-off principal correctly', () => {
            const debt = new Debt(debtData);
            debt.principalStartOfYear = 0;
            expect(debt.calculatePayment(1000)).toBe(0); // No payment needed
        });

        it('should handle 0% interest rate correctly', () => {
            debtData.interestRate = 0;
            const debt = new Debt(debtData);

            debt.payment = 500;
            const { interestAmount } = debt.calculateEndOfYearValues();
            expect(interestAmount).toBe(0); // No interest
        });

        it('should handle 100% interest rate correctly', () => {
            debtData.interestRate = 100;
            const debt = new Debt(debtData);

            debt.payment = 500;
            const { interestAmount } = debt.calculateEndOfYearValues();
            expect(interestAmount).toBeCloseTo(9500); // Full principal as interest
        });
    });
});
