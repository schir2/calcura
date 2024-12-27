import {beforeEach, describe, expect, it} from "vitest";
import PlanManager from "~/models/plan/PlanManager";
import {GrowthApplicationStrategy, IncomeTaxStrategy, InsufficientFundsStrategy, type Plan, RetirementStrategy} from "~/models/plan/Plan";
import {ExpenseFrequency, ExpenseType} from "~/models/expense/Expense";
import {ExpenseManager} from "~/models/expense/ExpenseManager"
import type ExpenseState from "~/models/expense/ExpenseState";
import {ProcessExpenseCommand} from "~/models/expense/ExpenseCommands";

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
    cashReserves: [],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 100_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: 'annual'
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: 'annual'
        }
    ],
    expenses: [
        {
            id: 1,
            name: 'Rent',
            frequency: ExpenseFrequency.Monthly,
            amount: 1_800,
            expenseType: ExpenseType.fixed,
            growthRate: 0,
            isEssential: true,
            isTaxDeductible: false,
            growsWithInflation: true,
        }
    ],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
}

let planManager: PlanManager;
let expenseManager: ExpenseManager;

describe("ExpenseManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        expenseManager = planManager.getExpenseManagerById(1)
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
                    frequency: ExpenseFrequency.Annually
                }]
            })
            expenseManager = planManager.getExpenseManagerById(1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(100);
        });
        it("quarterly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: ExpenseFrequency.Quarterly
                }]
            })
            expenseManager = planManager.getExpenseManagerById(1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(400);
        });
        it("monthly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: ExpenseFrequency.Monthly
                }]
            })
            expenseManager = planManager.getExpenseManagerById(1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(1_200);
        });
        it("weekly", () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100,
                    frequency: ExpenseFrequency.Weekly
                }]
            })
            expenseManager = planManager.getExpenseManagerById(1)
            const payment = expenseManager.calculatePayment();
            expect(payment).toBe(5_200);
        });

    })

    describe('process', () => {
        it('sufficient funds', () => {
            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.baseAmount = 1_800)
            expect(currentState.amountRequested = 21_600)
            expect(currentState.amountPaid = 21_600)
            expect(currentState.processed = true)
        })
        it('insufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                expenses: [{
                    ...planConfig.expenses[0],
                    amount: 100_000,
                    frequency: ExpenseFrequency.Quarterly
                }]
            })
            expenseManager = planManager.getExpenseManagerById(1)

            expenseManager.process()
            const currentState: ExpenseState = expenseManager.getCurrentState()
            expect(currentState.baseAmount = 100_000)
            expect(currentState.amountRequested = 1_200_000)
            expect(currentState.amountPaid = 105_000)
            expect(currentState.processed = true)
        })


    })

    describe('calculateGrowthAmount', () => {

    });

    describe('getCommands', () => {
        it('should return an array with ProcessExpenseCommand', () => {
            const commands = expenseManager.getCommands();
            expect(commands).toHaveLength(1);
            expect(commands[0]).toBeInstanceOf(ProcessExpenseCommand);
        });

        it('should execute ProcessExpenseCommand correctly', () => {
            const command = new ProcessExpenseCommand(expenseManager);
            command.execute();
            expect(expenseManager.getCurrentState().processed).toBe(true);
        });
    });


    describe('createNextState', () => {

    })
});
