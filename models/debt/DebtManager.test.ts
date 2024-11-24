import { describe, it, expect, beforeEach } from "vitest";
import DebtManager from "~/models/debt/DebtManager";
import DebtConfig, { type DebtPaymentStrategy } from "~/models/debt/DebtConfig";
import type { DebtData } from "~/models/debt/DebtConfig";
import type PlanState from "~/models/plan/PlanState";
import { AllowNegativeDisposableIncome } from "~/models/plan/PlanConfig";
import type DebtState from "~/models/debt/DebtState";

const fixedDebtData: DebtData = {
    id: "debt-1",
    name: "Test Debt",
    principal: 1000,
    interestRate: 5,
    paymentMinimum: 50,
    paymentStrategy: 'fixed',
    paymentFixedAmount: 100,
    paymentPercentage: 20,
};

const percentageDebtData: DebtData = {
    ...fixedDebtData,
    id: "debt-2",
    paymentStrategy: 'percentage_of_debt'
}

const maxDebtData: DebtData = {
    ...fixedDebtData,
    id: "debt-3",
    paymentStrategy: 'max'
}

const initialDebtState: DebtState = {
    principalStartOfYear: 1000,
    principalEndOfYear: undefined,
    paymentLifetime: 0,
    interestLifetime: 0,
    interestAmount: undefined,
    processed: false,
    payment: 0,

}

let debtManager: DebtManager;
const initialPlanState: PlanState = {
    age: 30,
    year: 2024,
    grossIncome: 60000,
    disposableIncome: 500,
    electiveLimit: 19500,
    deferredLimit: 20000,
    iraLimit: 7500,
    inflationRate: 2,
    savingsStartOfYear: 10000,
    endOfYearSavings: 0,
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome.none,
}

describe("DebtManager", () => {
    beforeEach(() => {
        debtManager = new DebtManager(new DebtConfig(fixedDebtData));
    });

    it("should initialize with correct state", () => {
        const state = debtManager.getCurrentState();
        expect(state).toStrictEqual(initialDebtState);
        expect(state.principalStartOfYear).toBe(fixedDebtData.principal);
        expect(state.payment).toBe(0);
        expect(state.processed).toBe(false);
    });

    it("should calculate fixed payment correctly", () => {
        const state = debtManager.getCurrentState();
        const payment = debtManager.calculatePayment(state, initialPlanState.disposableIncome, initialPlanState.allowNegativeDisposableIncome);
        expect(payment).toBe(100); // Fixed amount
    });

    it("should calculate percentage payment correctly", () => {
        debtManager = new DebtManager(fixedDebtData)
        const state = debtManager.getCurrentState();
        const payment = debtManager.calculatePayment(state, initialPlanState.disposableIncome, initialPlanState.allowNegativeDisposableIncome);
        expect(payment).toBe(100); // 10% of principal (1000 * 0.1)
    });

    it("should calculate max payment correctly", () => {
        debtManager = new DebtManager(maxDebtData)
        const state = debtManager.getCurrentState();
        const payment = debtManager.calculatePayment(state, initialPlanState.disposableIncome, initialPlanState.allowNegativeDisposableIncome);
        expect(payment).toBe(500); // Full principal
    });

    it("should not exceed disposable income", () => {
        debtManager.getConfig().paymentStrategy = 'max';
        const state = debtManager.getCurrentState();
        const payment = debtManager.calculatePayment(state, 200, AllowNegativeDisposableIncome.none);
        expect(payment).toBe(200); // Limited by disposable income
    });

    it("should process debt and update state correctly", () => {
        const planState = debtManager.process(initialPlanState);
        const currentState = debtManager.getCurrentState();

        expect(currentState.payment).toBe(100); // Fixed payment
        expect(currentState.interestAmount).toBeCloseTo(45); // (Principal - Payment) * Interest Rate
        expect(currentState.principalEndOfYear).toBeCloseTo(945); // Updated principal
        expect(currentState.processed).toBe(true);
        expect(planState.disposableIncome).toBe(400); // Disposable income reduced by payment
    });

    it("should throw error if processing already processed state", () => {
        debtManager.process(initialPlanState);
        expect(() => debtManager.process(initialPlanState)).toThrowError("The current state has already been processed.");
    });

    it("should create the next state correctly", () => {
        debtManager.process(initialPlanState);
        const previousState = debtManager.getCurrentState();
        const nextState = debtManager.advanceTimePeriod();

        expect(nextState.principalStartOfYear).toBeCloseTo(945); // Updated principal from previous state
        expect(nextState.processed).toBe(false);
        expect(nextState.payment).toBe(0);
    });

    it("should handle minimum payment for negative disposable income when allowed", () => {
        const state = debtManager.getCurrentState();
        const paymentMinimum = debtManager.calculatePayment(state, -50, AllowNegativeDisposableIncome.minimumOnly);
        expect(paymentMinimum).toBe(fixedDebtData.paymentMinimum); // Payment is not limited by disposable income
    });

    it("should handle full payment for negative disposable income when allowed", () => {
        const state = debtManager.getCurrentState();
        const paymentMaximum = debtManager.calculatePayment(state, -50, AllowNegativeDisposableIncome.full);
        expect(paymentMaximum).toBe(fixedDebtData.paymentFixedAmount); // Payment is not limited by disposable income
    });

    it("should respect minimum payment limits", () => {
        debtManager.getConfig().paymentFixedAmount = 30; // Below minimum payment
        const state = debtManager.getCurrentState();
        const payment = debtManager.calculatePayment(state, 500, AllowNegativeDisposableIncome.none);
        expect(payment).toBe(50); // Enforced minimum payment
    });
});
