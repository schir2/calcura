import { describe, expect, it, beforeEach, vi } from "vitest";
import DebtManager from "~/models/debt/DebtManager";
import DebtConfig from "~/models/debt/DebtConfig";
import { AllowNegativeDisposableIncome } from "~/models/plan/PlanConfig";
import { adjustForAllowNegativeDisposableIncome } from "~/utils";

vi.mock("~/utils", () => ({
    adjustForAllowNegativeDisposableIncome: vi.fn(),
}));

describe("DebtManager Class Tests", () => {
    let config: DebtConfig;
    let debtManager: DebtManager;

    beforeEach(() => {
        config = new DebtConfig({
            id: "1",
            name: "Car Loan",
            principal: 15000,
            interestRate: 5,
            paymentMinimum: 200,
            paymentStrategy: "fixed",
            paymentFixedAmount: 500,
            paymentPercentage: 0,
        });

        debtManager = new DebtManager(config);
        vi.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize DebtManager with an initial state", () => {
            const state = debtManager.getCurrentState();
            expect(state).toEqual({
                payment: 0,
                principalStartOfYear: 15000,
                interestLifetime: 0,
                paymentLifetime: 0,
                principalEndOfYear: undefined,
                interestAmount: undefined,
                processed: false,
            });
        });
    });

    describe("calculatePayment", () => {
        it("should calculate payment correctly for 'fixed' strategy", () => {
            const state = debtManager.getCurrentState();
            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            const payment = debtManager.calculatePayment(state, 1000, AllowNegativeDisposableIncome.none);
            expect(payment).toBe(500);
            expect(adjustForAllowNegativeDisposableIncome).toHaveBeenCalledWith({
                disposableIncome: 1000,
                amount: 500,
                minimum: 200,
                allowNegative: AllowNegativeDisposableIncome.none,
            });
        });

        it("should calculate payment correctly for 'percentage_of_debt' strategy", () => {
            config.paymentStrategy = "percentage_of_debt";
            config.paymentFixedAmount = 10; // 10% of principal
            const state = debtManager.getCurrentState();

            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            const payment = debtManager.calculatePayment(state, 2000, AllowNegativeDisposableIncome.none);
            expect(payment).toBe(1500); // 10% of 15000 principal
        });

        it("should calculate payment correctly for 'max' strategy", () => {
            config.paymentStrategy = "max";
            const state = debtManager.getCurrentState();

            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            const payment = debtManager.calculatePayment(state, 20000, AllowNegativeDisposableIncome.none);
            expect(payment).toBe(15000); // Pay off full principal
        });
    });

    describe("process", () => {
        it("should process the current state correctly", () => {
            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            const processedState = debtManager.process(1000, AllowNegativeDisposableIncome.none);

            expect(processedState.payment).toBe(500);
            expect(processedState.principalEndOfYear).toBeCloseTo(14825); // Principal - payment + interest
            expect(processedState.interestAmount).toBeCloseTo(325); // Interest = remaining principal * interest rate
            expect(processedState.processed).toBe(true);

            const currentState = debtManager.getCurrentState();
            expect(currentState).toEqual(processedState); // State should be updated
        });

        it("should throw an error when processing an already processed state", () => {
            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            debtManager.process(1000, AllowNegativeDisposableIncome.none);

            expect(() => debtManager.process(1000, AllowNegativeDisposableIncome.none)).toThrow(
                "The current state has already been processed."
            );
        });
    });

    describe("advanceToNextYear", () => {
        it("should advance to the next year and add a new state", () => {
            const initialState = debtManager.getCurrentState();
            initialState.principalEndOfYear = 14000; // Mock end-of-year principal

            const newState = debtManager.advanceToNextYear(initialState);

            expect(newState).toEqual({
                payment: 0,
                principalStartOfYear: 14000,
                interestLifetime: initialState.interestLifetime,
                paymentLifetime: initialState.paymentLifetime,
                principalEndOfYear: undefined,
                interestAmount: undefined,
                processed: false,
            });

            expect(debtManager.states.length).toBe(2);
            expect(debtManager.getCurrentState()).toEqual(newState);
        });
    });

    describe("Edge Cases", () => {
        it("should handle fully paid-off debt", () => {
            const state = debtManager.getCurrentState();
            state.principalStartOfYear = 0;

            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.amount);

            const processedState = debtManager.process(1000, AllowNegativeDisposableIncome.none);

            expect(processedState.payment).toBe(0);
            expect(processedState.principalEndOfYear).toBe(0);
            expect(processedState.interestAmount).toBe(0);
        });

        it("should handle 0 disposable income", () => {
            const state = debtManager.getCurrentState();

            (adjustForAllowNegativeDisposableIncome as any).mockImplementation((data) => data.minimum);

            const processedState = debtManager.process(0, AllowNegativeDisposableIncome.minimumOnly);

            expect(processedState.payment).toBe(200); // Minimum payment
        });
    });
});
