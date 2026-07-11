import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import {beforeEach, describe, expect, it} from "vitest";
import type {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import PlanManager from "~/models/plan/PlanManager";
import {assertDefined} from "../../../app/utils";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflation_rate: 3,
    growthRate: 6,
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
    cash_reserves: [
        {
            id: 1,
            name: 'Emergency Funds',
            cash_reserve_strategy: 'fixed',
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
            grows_with_inflation: true,
            retirement_spending_percentage: 100,
            is_retirement_only: false,
        },
        {
            id: 2,
            name: 'Gym',
            frequency: 'monthly',
            amount: 70,
            expense_type: 'fixed',
            growth_rate: 0,
            is_essential: false,
            is_tax_deductible: false,
            grows_with_inflation: true,
            retirement_spending_percentage: 100,
            is_retirement_only: false,
        },
        {
            id: 3,
            name: 'Climbing',
            frequency: 'annual',
            amount: 1450,
            expense_type: 'fixed',
            growth_rate: 0,
            is_essential: false,
            is_tax_deductible: false,
            grows_with_inflation: true,
            retirement_spending_percentage: 100,
            is_retirement_only: false,
        }],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    hsas: [],
    command_sequences: [],
}

let planManager: PlanManager
let cashReserveManager: CashReserveManager | undefined

describe("CashManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        cashReserveManager = planManager.getManagerById("cash_reserve", 1)
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
                        cash_reserve_strategy: 'fixed',
                        initial_amount: 0,
                        reserve_amount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cash_reserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(20_000)
        })
        it('fixedWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        cash_reserve_strategy: 'fixed',
                        initial_amount: 10_000,
                        reserve_amount: 20_000,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cash_reserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(10_000)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        cash_reserve_strategy: 'variable',
                        initial_amount: 0,
                        reserve_months: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById("cash_reserve", 1)

            assertDefined(cashReserveManager, 'cashReserve')
            expect(cashReserveManager.calculateContribution()).toBe(11_945)
        })
        it('variableWithInitial', () => {
            planManager = new PlanManager({
                ...planConfig,
                cash_reserves: [
                    {
                        ...planConfig.cash_reserves[0],
                        cash_reserve_strategy: 'variable',
                        initial_amount: 10_000,
                        reserve_months: 6,
                    }
                ]
            })
            cashReserveManager = planManager.getManagerById('cash_reserve',1)

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
            expect(planState.cash.net).toBe(85_000)
            expect(planState.cash.spent).toBe(20_000)

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
            cashReserveManager = planManager.getManagerById('cash_reserve', 1)
            assertDefined(cashReserveManager, 'cashReserve')
            cashReserveManager.process()
            const currentState = cashReserveManager.getCurrentState()
            const planState = planManager.getCurrentState()
            expect(currentState.amount_requested).toBe(490_000)
            expect(currentState.amount_paid).toBe(105_000)
            expect(currentState.cash_reserve_start_of_year).toBe(10_000)
            expect(currentState.cash_reserve_end_of_year).toBe(115_000)
            expect(planState.cash.net).toBe(0)
            expect(planState.cash.spent).toBe(105_000)

        })
    })

})