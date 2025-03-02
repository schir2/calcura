import {beforeEach, describe, expect, it} from "vitest";
import PlanManager from "~/models/plan/PlanManager";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/types/Plan";
import {ExpenseType} from "~/types/Expense";
import {ExpenseManager} from "~/models/expense/ExpenseManager"
import type ExpenseState from "~/types/ExpenseState";
import {Frequency} from "~/types/Frequency";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflationRate: 3,
    insufficientFundsStrategy: InsufficientFundsStrategy.None,
    growthApplicationStrategy: GrowthApplicationStrategy.Start,
    taxStrategy: IncomeTaxStrategy.Simple,
    taxRate: 30,
    lifeExpectancy: 85,
    retirementStrategy: RetirementStrategy.Age,
    retirementWithdrawalRate: 4,
    retirementIncomeGoal: 50000,
    retirementAge: 65,
    retirementSavingsAmount: 200000,
    retirementIncomeAdjustedForInflation: true,
    cashReserve: [],
    income: [
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 100_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: Frequency.Annually
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: Frequency.Annually
        }
    ],
    expenses: [
        {
            id: 1,
            name: 'Rent',
            frequency: Frequency.Monthly,
            amount: 1_800,
            expenseType: ExpenseType.fixed,
            growthRate: 0,
            isEssential: true,
            isTaxDeductible: false,
            growsWithInflation: false,
        }
    ],
    debts: [],
    taxDeferred: [],
    brokerage: [],
    ira: [],
    rothIra: [],
    commandSequences: [],
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
            expect(state.baseAmount).toBe(1800);
            expect(state.amountRequested).toBe(0);
            expect(state.amountPaid).toBe(0);
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
                    frequency: Frequency.Annually
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
                    frequency: Frequency.Quarterly
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
                    frequency: Frequency.Monthly
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
                    frequency: Frequency.Weekly
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
            expect(currentState.baseAmount).toBe(1_800)
            expect(currentState.amountRequested).toBe(21_600)
            expect(currentState.amountPaid).toBe(21_600)
            expect(currentState.processed).toBe(true)
        })
        it('insufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: Frequency.Quarterly
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.baseAmount).toBe(100_000)
            expect(currentState.amountRequested).toBe(400_000)
            expect(currentState.amountPaid).toBe(105_000)
            expect(currentState.processed).toBe(true)
        })
        it('growth at 10%', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: Frequency.Annually,
                    growthRate: 10,
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.baseAmount).toBe(100_000)
            expect(currentState.amountRequested).toBe(100_000)
            expect(currentState.amountPaid).toBe(100_000)
            expect(currentState.growthAmount).toBe(0)
            expect(currentState.processed).toBe(true)
            expenseManager.advanceTimePeriod()
            const newState = expenseManager.getCurrentState()
            expect(newState.baseAmount).toBe(110_000)
            expect(newState.growthAmount).toBe(10_000)
            expenseManager.process()
        })
        it('grows with inflation', () => {
            planManager = new PlanManager({
                ...planConfig,
                inflationRate: 5,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: Frequency.Annually,
                    growthRate: 10,
                    growsWithInflation: true,
                }]
            })
            expenseManager = planManager.getManagerById('expense', 1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.baseAmount).toBe(100_000)
            expect(currentState.amountRequested).toBe(100_000)
            expect(currentState.amountPaid).toBe(100_000)
            expect(currentState.growthAmount).toBe(0)
            expect(currentState.processed).toBe(true)
            expenseManager.advanceTimePeriod()
            const newState = expenseManager.getCurrentState()
            expect(newState.baseAmount).toBe(105_000)
            expect(newState.growthAmount).toBe(5_000)
            expenseManager.process()
        })


    })

    describe('calculateGrowthAmount', () => {

    });


    describe('createNextState', () => {
    })
});
