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
    inflation_rate: 3,
    growthRate: 6,
    insufficient_funds_strategy: InsufficientFundsStrategy.None,
    growth_application_strategy: GrowthApplicationStrategy.Start,
    tax_strategy: IncomeTaxStrategy.Simple,
    tax_rate: 30,
    life_expectancy: 85,
    retirement_strategy: RetirementStrategy.Age,
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50000,
    retirement_age: 65,
    retirement_savings_amount: 200000,
    retirement_income_adjusted_for_inflation: true,
    cash_reserves: [
        {
            id: 1,
            name: 'Emergency Funds',
            contribution_strategy: CashReserveStrategy.Fixed,
            reserve_months: 0,
            reserve_amount: 30_000,
            initial_amount: 10_000,
        }
    ],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 100_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: Frequency.Annually
        },
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 50_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: Frequency.Annually
        }
    ],
    expenses: [
        {
            id: 1,
            name: 'Rent',
            frequency: Frequency.Monthly,
            amount: 1_800,
            expense_type: ExpenseType.fixed,
            growth_rate: 0,
            is_essential: true,
            is_tax_deductible: false,
            grows_with_inflation: true,
        },
        {
            id: 2,
            name: 'Gym',
            frequency: Frequency.Monthly,
            amount: 70,
            expense_type: ExpenseType.fixed,
            growth_rate: 0,
            is_essential: false,
            is_tax_deductible: false,
            grows_with_inflation: true,
        },
        {
            id: 3,
            name: 'Climbing',
            frequency: Frequency.Annually,
            amount: 1450,
            expense_type: ExpenseType.fixed,
            growth_rate: 0,
            is_essential: false,
            is_tax_deductible: false,
            grows_with_inflation: true,
        }],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    command_sequences: [],
}

let planManager: PlanManager
let cashReserveManager: CashReserveManager | undefined

describe("CashManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        cashReserveManager = planManager.getManagerById("cashReserve", 1)
        assertDefined(cashReserveManager, 'cashReserve')
    });

    describe('constructor', () => {
        it('constructor', () => {
            assertDefined(cashReserveManager, 'cashReserve')
            const currentState = cashReserveManager.getCurrentState()
            expect(currentState.amount_requested).toBe(undefined)
            expect(currentState.amount_paid).toBe(undefined)
            expect(currentState.cash_reserve_start_of_year).toBe(10_000)
            expect(currentState.cash_reserve_end_of_year).toBe(undefined)
        })
    })

    describe('calculateContribution', () => {
        it('fixedWithZeroInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        contribution_strategy: CashReserveStrategy.Fixed,
                        initial_amount: 0,
                        reserve_amount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(20_000)
        })
        it('fixedWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        contribution_strategy: CashReserveStrategy.Fixed,
                        initial_amount: 10_000,
                        reserve_amount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(10_000)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        contribution_strategy: CashReserveStrategy.Variable,
                        initial_amount: 0,
                        reserve_months: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cashReserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(11_945)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        contribution_strategy: CashReserveStrategy.Variable,
                        initial_amount: 10_000,
                        reserve_months: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById('cashReserve',1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(1_945)
        })

    })

    describe('process', () => {
        it('sufficient funds', () => {

            assertDefined(cashReserveManager, 'cashReserve')
            cashReserveManager.process()
            const currentState = cashReserveManager.getCurrentState()
            const planState = planManager.getCurrentState()
            expect(currentState.amount_requested).toBe(20_000)
            expect(currentState.amount_paid).toBe(20_000)
            expect(currentState.cash_reserve_start_of_year).toBe(10_000)
            expect(currentState.cash_reserve_end_of_year).toBe(30_000)
            expect(planState.taxed_capital).toBe(85_000)
            expect(planState.taxed_withdrawals).toBe(20_000)

        })
        it('insufficient funds', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        reserve_amount: 500_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById('cashReserve', 1)
            assertDefined(cashReserveManager, 'cashReserve')
            cashReserveManager.process()
            const currentState = cashReserveManager.getCurrentState()
            const planState = planManager.getCurrentState()
            expect(currentState.amount_requested).toBe(490_000)
            expect(currentState.amount_paid).toBe(105_000)
            expect(currentState.cash_reserve_start_of_year).toBe(10_000)
            expect(currentState.cash_reserve_end_of_year).toBe(115_000)
            expect(planState.taxed_capital).toBe(0)
            expect(planState.taxed_withdrawals).toBe(105_000)

        })
    })

})