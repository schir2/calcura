import type {Plan} from "~/types/Plan";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    RetirementStrategy
} from "~/types/Plan";
import {CashReserveStrategy} from "~/types/CashReserve";
import {beforeEach, describe, expect, it} from "vitest";
import type {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import PlanManager from "~/models/plan/PlanManager";
import {ExpenseType} from "~/types/Expense";
import {Frequency} from "~/types/Frequency";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflationRate: 3,
    growthRate: 6,
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
    cashReserves: [
        {
            id: 1,
            name: 'Emergency Funds',
            cashReserveStrategy: CashReserveStrategy.Fixed,
            reserveMonths: 0,
            reserveAmount: 30_000,
            initialAmount: 10_000,
        }
    ],
    incomes: [
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
            growsWithInflation: true,
        },
        {
            id: 2,
            name: 'Gym',
            frequency: Frequency.Monthly,
            amount: 70,
            expenseType: ExpenseType.fixed,
            growthRate: 0,
            isEssential: false,
            isTaxDeductible: false,
            growsWithInflation: true,
        },
        {
            id: 3,
            name: 'Climbing',
            frequency: Frequency.Annually,
            amount: 1450,
            expenseType: ExpenseType.fixed,
            growthRate: 0,
            isEssential: false,
            isTaxDeductible: false,
            growsWithInflation: true,
        }],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
}

let planManager: PlanManager
let cashReserveManager: CashReserveManager | undefined

describe("CashManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        cashReserveManager = planManager.getManagerById("cashReserveManagers", 1)
        assertDefined(cashReserveManager, 'cashReserveManagers')
    });

    describe('constructor', () => {
        it('constructor', () => {
            assertDefined(cashReserveManager, 'cashReserveManagers')
            const currentState = cashReserveManager.getCurrentState()
            expect(currentState.amountRequested).toBe(undefined)
            expect(currentState.amountPaid).toBe(undefined)
            expect(currentState.cashReserveStartOfYear).toBe(10_000)
            expect(currentState.cashReserveEndOfYear).toBe(undefined)
        })
    })

    describe('calculateContribution', () => {
        it('fixedWithZeroInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {
                        ...planConfig.cashReserves[0],
                        cashReserveStrategy: CashReserveStrategy.Fixed,
                        initialAmount: 0,
                        reserveAmount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserveManagers", 1)

            assertDefined(cashReserveManager, 'cashReserveManagers')
            expect(cashReserveManager.calculateContribution()).toBe(20_000)
        })
        it('fixedWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {
                        ...planConfig.cashReserves[0],
                        cashReserveStrategy: CashReserveStrategy.Fixed,
                        initialAmount: 10_000,
                        reserveAmount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserveManagers", 1)

            assertDefined(cashReserveManager, 'cashReserveManagers')
            expect(cashReserveManager.calculateContribution()).toBe(10_000)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {
                        ...planConfig.cashReserves[0],
                        cashReserveStrategy: CashReserveStrategy.Variable,
                        initialAmount: 0,
                        reserveMonths: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserveManagers", 1)

            assertDefined(cashReserveManager, 'cashReserveManagers')
            expect(cashReserveManager.calculateContribution()).toBe(11_945)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {
                        ...planConfig.cashReserves[0],
                        cashReserveStrategy: CashReserveStrategy.Variable,
                        initialAmount: 10_000,
                        reserveMonths: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById('cashReserveManagers',1)

            assertDefined(cashReserveManager, 'cashReserveManagers')
            expect(cashReserveManager.calculateContribution()).toBe(1_945)
        })

    })

    describe('process', () => {
        it('sufficient funds', () => {

            assertDefined(cashReserveManager, 'cashReserveManagers')
            cashReserveManager.process()
            const currentState = cashReserveManager.getCurrentState()
            const planState = planManager.getCurrentState()
            expect(currentState.amountRequested).toBe(20_000)
            expect(currentState.amountPaid).toBe(20_000)
            expect(currentState.cashReserveStartOfYear).toBe(10_000)
            expect(currentState.cashReserveEndOfYear).toBe(30_000)
            expect(planState.taxedCapital).toBe(85_000)
            expect(planState.taxedWithdrawals).toBe(20_000)

        })
        it('insufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {
                        ...planConfig.cashReserves[0],
                        reserveAmount: 500_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById('cashReserveManagers', 1)
            assertDefined(cashReserveManager, 'cashReserveManagers')
            cashReserveManager.process()
            const currentState = cashReserveManager.getCurrentState()
            const planState = planManager.getCurrentState()
            expect(currentState.amountRequested).toBe(490_000)
            expect(currentState.amountPaid).toBe(105_000)
            expect(currentState.cashReserveStartOfYear).toBe(10_000)
            expect(currentState.cashReserveEndOfYear).toBe(115_000)
            expect(planState.taxedCapital).toBe(0)
            expect(planState.taxedWithdrawals).toBe(105_000)

        })
    })

})