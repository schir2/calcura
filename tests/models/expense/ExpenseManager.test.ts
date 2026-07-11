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
            retirement_spending_percentage: 100,
            is_retirement_only: false,
        }
    ],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    hsas: [],
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
        it('no growth', () => {
            expect(expenseManager.calculateGrowthAmount(100_000)).toBe(0)
        })

        it('own growth_rate', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{...planConfig.expenses[0], growth_rate: 10, grows_with_inflation: false}]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            expect(expenseManager.calculateGrowthAmount(100_000)).toBe(10_000)
        })

        it('grows_with_inflation uses plan inflation_rate', () => {
            planManager = new PlanManager({
                ...planConfig,
                inflation_rate: 5,
                expenses: [{...planConfig.expenses[0], grows_with_inflation: true}]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            expect(expenseManager.calculateGrowthAmount(100_000)).toBe(5_000)
        })

        it('grows_with_inflation takes precedence over own growth_rate', () => {
            planManager = new PlanManager({
                ...planConfig,
                inflation_rate: 3,
                expenses: [{...planConfig.expenses[0], growth_rate: 10, grows_with_inflation: true}]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            expect(expenseManager.calculateGrowthAmount(100_000)).toBe(3_000)
        })
    })


    describe('retirement spending', () => {
        function makeManager(overrides: Partial<Plan['expenses'][number]>) {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{...planConfig.expenses[0], amount: 100, frequency: 'annual', ...overrides}]
            })
            return planManager.getManagerById('expense', 1)
        }

        it('working year uses full amount even when a retirement percentage is set', () => {
            expenseManager = makeManager({retirement_spending_percentage: 50})
            expect(expenseManager.calculatePayment()).toBe(100)
        })

        it('retirement-only expense is zero while working', () => {
            expenseManager = makeManager({is_retirement_only: true})
            expect(expenseManager.calculatePayment()).toBe(0)
        })

        it('stops at retirement (0%)', () => {
            expenseManager = makeManager({retirement_spending_percentage: 0})
            planManager.getCurrentState().retired = true
            expect(expenseManager.calculatePayment()).toBe(0)
        })

        it('continues unchanged at retirement (100%)', () => {
            expenseManager = makeManager({retirement_spending_percentage: 100})
            planManager.getCurrentState().retired = true
            expect(expenseManager.calculatePayment()).toBe(100)
        })

        it('reduces at retirement (50%)', () => {
            expenseManager = makeManager({retirement_spending_percentage: 50})
            planManager.getCurrentState().retired = true
            expect(expenseManager.calculatePayment()).toBe(50)
        })

        it('grows at retirement (150%)', () => {
            expenseManager = makeManager({retirement_spending_percentage: 150})
            planManager.getCurrentState().retired = true
            expect(expenseManager.calculatePayment()).toBe(150)
        })

        it('retirement-only expense is active and scaled after retirement', () => {
            expenseManager = makeManager({is_retirement_only: true, retirement_spending_percentage: 150})
            planManager.getCurrentState().retired = true
            expect(expenseManager.calculatePayment()).toBe(150)
        })
    })

    describe('createNextState', () => {
        it('no growth — base_amount unchanged, growth_amount 0', () => {
            const current = expenseManager.getCurrentState()
            const next = expenseManager.createNextState(current)
            expect(next.base_amount).toBe(1_800)
            expect(next.growth_amount).toBe(0)
            expect(next.amount_requested).toBe(0)
            expect(next.amount_paid).toBe(0)
            expect(next.processed).toBe(false)
        })

        it('own growth_rate — base_amount grows by growth_rate', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{...planConfig.expenses[0], amount: 100_000, frequency: 'annual', growth_rate: 10}]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const next = expenseManager.createNextState(expenseManager.getCurrentState())
            expect(next.base_amount).toBe(110_000)
            expect(next.growth_amount).toBe(10_000)
            expect(next.processed).toBe(false)
        })

        it('grows_with_inflation — base_amount grows by inflation_rate', () => {
            planManager = new PlanManager({
                ...planConfig,
                inflation_rate: 5,
                expenses: [{...planConfig.expenses[0], amount: 100_000, frequency: 'annual', grows_with_inflation: true}]
            })
            expenseManager = planManager.getManagerById('expense', 1)
            const next = expenseManager.createNextState(expenseManager.getCurrentState())
            expect(next.base_amount).toBe(105_000)
            expect(next.growth_amount).toBe(5_000)
        })
    })
});
