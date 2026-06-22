import {beforeEach, describe, expect, it} from "vitest";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import {ExpenseManager} from "~/models/expense/ExpenseManager"
import type ExpenseState from "#shared/types/ExpenseState";

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
    expenses: [
        {
            id: 1,
            name: 'Rent',
            frequency: 'monthly',
            amount: 1_800,
            expense_type: 'fixed',
            growth_rate: 0,
            is_essential: true,
            is_tax_deductible: false,
            grows_with_inflation: false,
        }
    ],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    command_sequences: [],
}

let planManager: PlanManager;
let expenseManager: ExpenseManager;

describe("ExpenseManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        expenseManager = planManager.getManagerById('expense', 1)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const state = expenseManager.getCurrentState();
            expect(state.base_amount).toBe(1800);
            expect(state.amount_requested).toBe(0);
            expect(state.amount_paid).toBe(0);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculatePayment', () => {
        it("annually", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: 'annual'
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(100);
        });
        it("quarterly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: 'quarterly'
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(400);
        });
        it("monthly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: 'monthly'
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(1_200);
        });
        it("weekly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: 'weekly'
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(5_200);
        });

    })

    describe('process', () => {
        it('sufficient funds', () => {
            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.base_amount).toBe(1_800)
            expect(currentState.amount_requested).toBe(21_600)
            expect(currentState.amount_paid).toBe(21_600)
            expect(currentState.processed).toBe(true)
        })
        it('insufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: 'quarterly'
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.base_amount).toBe(100_000)
            expect(currentState.amount_requested).toBe(400_000)
            expect(currentState.amount_paid).toBe(105_000)
            expect(currentState.processed).toBe(true)
        })
        it('growth at 10%', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: 'annual',
                    growth_rate: 10,
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.base_amount).toBe(100_000)
            expect(currentState.amount_requested).toBe(100_000)
            expect(currentState.amount_paid).toBe(100_000)
            expect(currentState.growth_amount).toBe(0)
            expect(currentState.processed).toBe(true)
            expenseManager.advanceTimePeriod()
            const newState = expenseManager.getCurrentState()
            expect(newState.base_amount).toBe(110_000)
            expect(newState.growth_amount).toBe(10_000)
            expenseManager.process()
        })
        it('grows with inflation', () => {
            planManager = new PlanManager({
                ...planConfig,
                inflation_rate: 5,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: 'annual',
                    growth_rate: 10,
                    grows_with_inflation: true,
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.base_amount).toBe(100_000)
            expect(currentState.amount_requested).toBe(100_000)
            expect(currentState.amount_paid).toBe(100_000)
            expect(currentState.growth_amount).toBe(0)
            expect(currentState.processed).toBe(true)
            expenseManager.advanceTimePeriod()
            const newState = expenseManager.getCurrentState()
            expect(newState.base_amount).toBe(105_000)
            expect(newState.growth_amount).toBe(5_000)
            expenseManager.process()
        })


    })

    describe('calculateGrowthAmount', () => {

    });


    describe('createNextState', () => {
    })
});
