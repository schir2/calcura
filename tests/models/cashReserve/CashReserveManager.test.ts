import type {Plan} from "~/models/plan/Plan";
import {GrowthApplicationStrategy, IncomeTaxStrategy, InsufficientFundsStrategy, RetirementStrategy} from "~/models/plan/Plan";
import {CashReserveStrategy} from "~/models/cashReserve/CashReserve";
import {beforeEach, describe, expect, it} from "vitest";
import type {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import PlanManager from "~/models/plan/PlanManager";

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
    expenses: [],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
}

let planManager: PlanManager
let cashReserveManager: CashReserveManager

describe("CashManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        cashReserveManager = planManager.getCashReserveManagerById(1)
    });

    describe('constructor', () => {
        it('constructor', () => {
            const currentState = cashReserveManager.getCurrentState()
            expect(currentState.amountRequested).toBe(undefined)
            expect(currentState.amountPaid).toBe(undefined)
            expect(currentState.cashReserveStartOfYear).toBe(10_000)
            expect(currentState.cashReserveEndOfYear).toBe(undefined)
        })
    })

    describe('process', () => {
        it('sufficient funds', () => {
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
        it('sufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                cashReserves: [
                    {...planConfig.cashReserves[0],
                        reserveAmount: 500_000,
                    }
                ]
            })
            cashReserveManager = planManager.getCashReserveManagerById(1)
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