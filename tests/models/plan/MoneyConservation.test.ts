import {describe, expect, it} from "vitest";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";

const basePlan = {
    id: 1,
    name: "Conservation Plan",
    age: 30,
    year: 2026,
    inflation_rate: 0,
    growth_application_strategy: 'start',
    tax_strategy: 'simple',
    tax_rate: 0,
    life_expectancy: 34,
    retirement_strategy: 'age',
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50_000,
    retirement_age: 65,
    retirement_savings_amount: 200_000,
    retirement_income_adjusted_for_inflation: false,
    cash_reserves: [],
    incomes: [],
    expenses: [],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    hsas: [],
    command_sequences: [],
} as unknown as Plan

const income = {id: 1, name: 'Salary', gross_income: 100_000, growth_rate: 0, income_type: 'ordinary', frequency: 'annual'}
const brokerage = {id: 1, name: 'B', growth_rate: 0, initial_balance: 0, contribution_strategy: 'fixed', contribution_fixed_amount: 5_000, contribution_percentage: 0}
const ira = {id: 1, name: 'I', growth_rate: 0, initial_balance: 0, contribution_strategy: 'fixed', contribution_fixed_amount: 4_000, contribution_percentage: 0}
const rothIra = {id: 1, name: 'R', growth_rate: 0, initial_balance: 0, contribution_strategy: 'fixed', contribution_fixed_amount: 2_000, contribution_percentage: 0}
const hsa = {id: 1, name: 'H', growth_rate: 0, initial_balance: 0, contribution_strategy: 'fixed', contribution_fixed_amount: 3_000}
const taxDeferred = {id: 1, name: 'T', growth_rate: 0, initial_balance: 0, elective_contribution_strategy: 'fixed', elective_contribution_fixed_amount: 6_000, employer_contribution_strategy: 'none'}
const cashReserve = {id: 1, name: 'C', initial_amount: 10_000, cash_reserve_strategy: 'fixed', reserve_amount: 12_000, reserve_months: 0}
const debt = {id: 1, name: 'D', principal: 100_000, interest_rate: 10, payment_strategy: 'fixed', payment_fixed_amount: 6_000, payment_minimum: 0, payment_percentage: 0, frequency: 'annual'}
const expense = {id: 1, name: 'E', frequency: 'annual', amount: 20_000, expense_type: 'fixed', growth_rate: 0, is_essential: true, is_tax_deductible: false, grows_with_inflation: false, retirement_spending_percentage: 100, is_retirement_only: false}

const sequence = (...models: string[]) => ({
    ordering_type: 'sequential',
    command_sequence_commands: models.map((model_name, i) => ({
        id: i + 1, order: i + 1, is_active: true, command: {model_name, model_id: 1},
    })),
}) as never

const plan = (patch: Partial<Plan>) => new PlanManager({...basePlan, ...patch} as Plan)

describe("money conservation", () => {

    describe("zero-cash year: nothing may be recorded when no cash moved", () => {
        const cases: Array<[ModelName, Partial<Plan>, string[]]> = [
            ['brokerage', {brokerages: [brokerage] as never}, ['contribution']],
            ['ira', {iras: [ira] as never}, ['contribution']],
            ['roth_ira', {roth_iras: [rothIra] as never}, ['contribution']],
            ['hsa', {hsas: [hsa] as never}, ['contribution']],
            ['tax_deferred', {tax_deferreds: [taxDeferred] as never}, ['contribution', 'elective_contribution', 'employer_contribution']],
            ['cash_reserve', {cash_reserves: [cashReserve] as never}, ['amount_paid']],
            ['debt', {debts: [debt] as never}, ['payment']],
            ['expense', {expenses: [expense] as never}, ['amount_paid']],
        ]

        for (const [model, patch, recordedFields] of cases) {
            it(`${model} records zero and moves no cash`, () => {
                const planManager = plan({...patch, incomes: []})
                const states = planManager.simulate(sequence(model))
                const state = states[0]!
                const managerState = planManager.getManagerById(model, 1).getStates()[0] as Record<string, number>

                for (const field of recordedFields) {
                    expect(managerState[field], `${model}.${field}`).toBe(0)
                }
                expect(state.cash.spent).toBe(0)
                expect(state.assets.taxable.contribution).toBe(0)
                expect(state.assets.tax_deferred.contribution).toBe(0)
                expect(state.assets.tax_exempt.contribution).toBe(0)
                expect(state.assets.cash_reserve.contribution).toBe(0)
                expect(state.liabilities.debt.paid).toBe(0)
                expect(state.liabilities.expense.paid).toBe(0)
            })
        }
    })

    describe("recorded state equals actual withdrawn", () => {
        it("cash reserve contributes the amount withdrawn, not its balance", () => {
            const planManager = plan({incomes: [income] as never, cash_reserves: [cashReserve] as never})
            const states = planManager.simulate(sequence('income', 'cash_reserve'))
            const managerStates = planManager.getManagerById('cash_reserve', 1).getStates()

            const firstYear = states[0]!
            expect(managerStates[0]!.amount_paid).toBe(2_000)
            expect(firstYear.assets.cash_reserve.contribution).toBe(2_000)
            expect(firstYear.cash.spent).toBe(2_000)

            const secondYear = states[1]!
            expect(managerStates[1]!.amount_paid).toBe(0)
            expect(secondYear.assets.cash_reserve.contribution).toBe(0)
            expect(secondYear.assets.cash_reserve.contribution_lifetime).toBe(2_000)
        })

        it("cash reserve balance tracks the reserve, seeded from initial_amount", () => {
            const planManager = plan({incomes: [income] as never, cash_reserves: [cashReserve] as never})
            const states = planManager.simulate(sequence('income', 'cash_reserve'))
            const managerStates = planManager.getManagerById('cash_reserve', 1).getStates()

            expect(planManager.getInitialState().assets.cash_reserve.balance_start).toBe(10_000)
            expect(states[0]!.assets.cash_reserve.balance_end).toBe(12_000)
            expect(states[0]!.assets.cash_reserve.balance_end).toBe(managerStates[0]!.cash_reserve_end_of_year)
            expect(states[1]!.assets.cash_reserve.balance_end).toBe(12_000)
        })

        it("employer contributions are recorded but not withdrawn from cash", () => {
            const matched = {
                ...taxDeferred,
                income: {id: 1},
                elective_contribution_strategy: 'fixed',
                elective_contribution_fixed_amount: 6_000,
                employer_contribution_strategy: 'fixed',
                employer_contribution_fixed_amount: 3_000,
            }
            const planManager = plan({incomes: [income] as never, tax_deferreds: [matched] as never})
            const states = planManager.simulate(sequence('income', 'tax_deferred'))
            const managerState = planManager.getManagerById('tax_deferred', 1).getStates()[0]!

            expect(managerState.elective_contribution).toBe(6_000)
            expect(managerState.employer_contribution).toBe(3_000)
            expect(managerState.contribution).toBe(9_000)
            expect(states[0]!.assets.tax_deferred.contribution).toBe(9_000)
            expect(states[0]!.cash.taxable).toBe(100_000 - 6_000)
        })
    })

    describe("conservation across a full simulation", () => {
        const everything = {
            incomes: [income] as never,
            brokerages: [brokerage] as never,
            iras: [ira] as never,
            roth_iras: [rothIra] as never,
            hsas: [hsa] as never,
            tax_deferreds: [taxDeferred] as never,
            cash_reserves: [cashReserve] as never,
            debts: [debt] as never,
            expenses: [expense] as never,
        }
        const models = ['income', 'expense', 'debt', 'tax_deferred', 'ira', 'hsa', 'roth_ira', 'brokerage', 'cash_reserve']

        it("post-tax outflows equal cash spent, every year", () => {
            const states = plan(everything).simulate(sequence(...models))

            for (const state of states) {
                const postTaxOutflows = state.assets.taxable.contribution
                    + state.assets.tax_exempt.contribution
                    + state.assets.cash_reserve.contribution
                    + state.liabilities.debt.paid
                    + state.liabilities.expense.paid
                expect(postTaxOutflows, `age ${state.plan.age}`).toBeCloseTo(state.cash.spent, 6)
            }
        })

        it("no bucket outruns available cash, and cash never goes negative", () => {
            const states = plan(everything).simulate(sequence(...models))

            for (const state of states) {
                expect(state.cash.net, `age ${state.plan.age}`).toBeGreaterThanOrEqual(0)
                expect(state.cash.spent, `age ${state.plan.age}`).toBeLessThanOrEqual(state.income.net + 1e-6)
            }
        })
    })
})
