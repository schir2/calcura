import {beforeEach, describe, expect, it} from "vitest";
import DebtManager from "~/models/debt/DebtManager";
import type {Debt} from "#shared/types/Debt";
import PlanManager from "~/models/plan/PlanManager";
import type {Plan} from "#shared/types/Plan";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflation_rate: 3,
    insufficient_funds_strategy: 'none',
    growth_application_strategy: 'start',
    tax_strategy: 'simple',
    tax_rate: 30,
    life_expectancy: 85,
    retirement_strategy: 'age',
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50000,
    retirement_age: 65,
    retirement_savings_amount: 200000,
    retirement_income_adjusted_for_inflation: true,
    cash_reserves: [],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 100_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: 'annual'
        },
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 50_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: 'annual'
        }
    ],
    expenses: [],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    command_sequences: [],
}

const debt: Debt = {
    id: 1,
    name: "Test Debt",
    principal: 1000,
    interest_rate: 5,
    payment_minimum: 50,
    payment_strategy: 'fixed',
    payment_fixed_amount: 100,
    payment_percentage: 20,
    frequency: 'annual'

};

let planManager: PlanManager;

describe("DebtManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const debtManager = new DebtManager(planManager, debt);
            const state = debtManager.getCurrentState();
            expect(state.payment).toBe(0);
            expect(state.payment_lifetime).toBe(0);
            expect(state.interest_lifetime).toBe(0);
            expect(state.principal_start_of_year).toBe(1_000);
            expect(state.interest_amount).toBe(undefined);
            expect(state.principal_end_of_year).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculatePayment', () => {
        it("should calculate fixed payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                payment_strategy: 'fixed',
                principal: 1000,
                payment_percentage: 10,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(100);
        });

        it("should calculate percentage payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                payment_strategy: 'percentage_of_debt',
                principal: 1000,
                payment_percentage: 10,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(100);
        });

        it("should calculate max payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                payment_strategy: 'maximum_payment',
                principal: 1000,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(1000);
        });

        it("should calculate minimum payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                payment_strategy: 'minimum_payment',
                principal: 2000,
                payment_minimum: 100,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(100);
        })
    })

    describe('process', () => {

        it("should process debt and update state correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                payment_fixed_amount: 1_000,
                interest_rate: 10,
            })
            debtManager.process();
            const planState = debtManager.orchestrator.getCurrentState();
            const currentState = debtManager.getCurrentState();

            expect(currentState.payment).toBe(1_000);
            expect(currentState.payment_lifetime).toBe(1_000);
            expect(currentState.interest_amount).toBeCloseTo(900);
            expect(currentState.interest_lifetime).toBe(900);
            expect(currentState.principal_end_of_year).toBeCloseTo(9900);
            expect(currentState.processed).toBe(true);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(104_000);
        });

        it("should process debt and update state correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                payment_fixed_amount: 1_000,
                interest_rate: 10,
            })
            debtManager.process();
            debtManager.advanceTimePeriod()
            debtManager.process();
            const planState = debtManager.orchestrator.getCurrentState();
            const currentState = debtManager.getCurrentState();

            expect(currentState.payment).toBe(1_000);
            expect(currentState.payment_lifetime).toBe(2_000);
            expect(currentState.interest_amount).toBe(890);
            expect(currentState.interest_lifetime).toBe(900+890);
            expect(currentState.principal_end_of_year).toBeCloseTo(9790);
            expect(currentState.processed).toBe(true);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(103_000);
        });

        it("should throw error if processing already processed state", () => {
            const debtManager = new DebtManager(planManager, debt)
            debtManager.process();
        });

    })

    describe('calculateInterest', () => {
        it('should return 0 interest for a 0 principal', () => {
            const debtManager = new DebtManager(planManager, debt);
            expect(debtManager.calculateInterest(0)).toBe(0);
        });

        it('should calculate interest correctly for non-zero principal', () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                interest_rate: 5,
            });
            expect(debtManager.calculateInterest(1000)).toBeCloseTo(50); // 5% of 1000
        });

        it('should return 0 interest for a 0 interest rate', () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                interest_rate: 0,
            });
            expect(debtManager.calculateInterest(1000)).toBe(0);
        });
    });


    describe('createNextState', () => {

        it("should process debt create the next state", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                payment_fixed_amount: 1_000,
                interest_rate: 10,
            })
            debtManager.process();
            const debtState = debtManager.getCurrentState();
            const newState = debtManager.createNextState(debtState);

            expect(newState.payment).toBe(0);
            expect(newState.payment_lifetime).toBe(1_000);
            expect(newState.interest_amount).toBe(undefined);
            expect(newState.interest_lifetime).toBe(900);
            expect(newState.principal_start_of_year).toBe(debtState.principal_end_of_year);
            expect(newState.principal_end_of_year).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
