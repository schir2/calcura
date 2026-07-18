import {describe, expect, it} from "vitest";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import {BrokerageManager} from "~/models/brokerage/BrokerageManager";
import {IraManager} from "~/models/ira/IraManager";
import {RothIraManager} from "~/models/rothIra/RothIraManager";

// Minimal plan: 30% ordinary tax, 15% capital gains, no entities (managers are constructed directly).
function makePlan(overrides: Partial<Plan> = {}): PlanManager {
    return new PlanManager({
        id: 1, name: "Plan", age: 60, year: 2025, inflation_rate: 0,
        growth_application_strategy: 'start', tax_strategy: 'simple', tax_rate: 30, capital_gains_rate: 15,
        life_expectancy: 90, retirement_strategy: 'age', retirement_withdrawal_rate: 4,
        retirement_income_goal: 50000, retirement_age: 61, retirement_savings_amount: 200000,
        retirement_income_adjusted_for_inflation: false,
        cash_reserves: [], incomes: [{id: 1, name: 'Salary', gross_income: 100_000, growth_rate: 0, income_type: 'ordinary', frequency: 'annual'}],
        expenses: [], debts: [], tax_deferreds: [], brokerages: [], iras: [], roth_iras: [], hsas: [],
        command_sequences: [], ...overrides,
    } as Plan)
}

const emptyBrokerage = {
    id: 1, name: 'B', growth_rate: 0, initial_balance: 0,
    contribution_strategy: 'fixed' as const, contribution_percentage: 0, contribution_fixed_amount: 0,
}
const salary = {id: 1, name: 'Salary', gross_income: 100_000, growth_rate: 0, income_type: 'ordinary' as const, frequency: 'annual' as const}

// Seed a processed account state with a given balance (and basis, for brokerage).
function seedBrokerage(plan: PlanManager, id: number, balance: number, basis: number): BrokerageManager {
    const manager = new BrokerageManager(plan, {...emptyBrokerage, id})
    manager.process()
    const state = manager.getCurrentState()
    state.balance_end_of_year = balance
    state.cost_basis = basis
    return manager
}

describe("retirement withdrawal tax", () => {
    describe("brokerage — pro-rata basis (only the gain is taxed)", () => {
        it("grosses up so the net covers the need, taxing only the gain fraction", () => {
            const plan = makePlan()
            const brokerage = seedBrokerage(plan, 1, 40_000, 10_000) // gain 30k → 75%; rate = 0.75*15% = 11.25%

            const net = brokerage.withdraw(5_000)
            const after = brokerage.getCurrentState()
            const gross = 5_000 / (1 - 0.1125)

            expect(net).toBeCloseTo(5_000, 6)
            expect(after.balance_end_of_year).toBeCloseTo(40_000 - gross, 4)
            expect(after.cost_basis).toBeCloseTo(10_000 - 10_000 * (gross / 40_000), 4)
        })

        it("taxes a fully-appreciated account more than a fresh one (per-account, not blended)", () => {
            const plan = makePlan()
            const appreciated = seedBrokerage(plan, 1, 40_000, 0)       // all gain
            const fresh = seedBrokerage(plan, 2, 40_000, 40_000)        // all basis

            appreciated.withdraw(5_000)
            fresh.withdraw(5_000)
            const a = appreciated.getCurrentState().balance_end_of_year!
            const f = fresh.getCurrentState().balance_end_of_year!

            expect(f).toBeCloseTo(35_000, 6)                            // rate 0 → gross = need
            expect(a).toBeCloseTo(40_000 - 5_000 / 0.85, 4)            // 15% on 100% gain
            expect(a).toBeLessThan(f)
        })
    })

    it("tax-deferred withdrawal is grossed up at the ordinary tax rate", () => {
        const plan = makePlan()
        const ira = new IraManager(plan, {
            id: 1, name: 'IRA', growth_rate: 0, initial_balance: 0,
            contribution_strategy: 'fixed', contribution_percentage: 0, contribution_fixed_amount: 0, income: salary,
        })
        ira.process()
        ira.getCurrentState().balance_end_of_year = 10_000

        const net = ira.withdraw(7_000) // 30% tax → gross 10k delivers net 7k, draining the account

        expect(net).toBeCloseTo(7_000, 6)
        expect(ira.getCurrentState().balance_end_of_year).toBeCloseTo(0, 6)
    })

    it("Roth withdrawal is tax-free (1:1)", () => {
        const plan = makePlan()
        const roth = new RothIraManager(plan, {
            id: 1, name: 'Roth', growth_rate: 0, initial_balance: 0,
            contribution_strategy: 'fixed', contribution_percentage: 0, contribution_fixed_amount: 0, income: salary,
        })
        roth.process()
        roth.getCurrentState().balance_end_of_year = 10_000

        const net = roth.withdraw(7_000)

        expect(net).toBe(7_000)
        expect(roth.getCurrentState().balance_end_of_year).toBe(3_000)
    })

    it("caps the withdrawal at the balance and returns only the net it could raise", () => {
        const plan = makePlan()
        const ira = new IraManager(plan, {
            id: 1, name: 'IRA', growth_rate: 0, initial_balance: 0,
            contribution_strategy: 'fixed', contribution_percentage: 0, contribution_fixed_amount: 0, income: salary,
        })
        ira.process()
        ira.getCurrentState().balance_end_of_year = 10_000

        const net = ira.withdraw(1_000_000) // can't cover — drains fully, delivers balance * (1 - 30%)

        expect(net).toBeCloseTo(7_000, 6)
        expect(ira.getCurrentState().balance_end_of_year).toBeCloseTo(0, 6)
    })
})

describe("predefined drain order (end-to-end)", () => {
    it("drains the brokerage before the cash-reserve emergency fund", () => {
        // Working years break even (income == expense, 0% tax) so nothing carries into retirement;
        // at age 62 the full 40k expense must come from savings.
        const plan = new PlanManager({
            id: 1, name: "Plan", age: 60, year: 2025, inflation_rate: 0,
            growth_application_strategy: 'start', tax_strategy: 'simple', tax_rate: 0, capital_gains_rate: 15,
            life_expectancy: 62, retirement_strategy: 'age', retirement_withdrawal_rate: 4,
            retirement_income_goal: 50000, retirement_age: 61, retirement_savings_amount: 200000,
            retirement_income_adjusted_for_inflation: false,
            incomes: [{...salary, gross_income: 40_000}],
            expenses: [{id: 1, name: 'Living', frequency: 'annual', amount: 40_000, expense_type: 'fixed', growth_rate: 0, is_essential: true, is_tax_deductible: false, grows_with_inflation: false, retirement_spending_percentage: 100, is_retirement_only: false}],
            brokerages: [{...emptyBrokerage, initial_balance: 30_000}],
            cash_reserves: [{id: 1, name: 'Reserve', contribution_strategy: 'fixed', reserve_months: 0, reserve_amount: 20_000, initial_amount: 20_000}],
            debts: [], tax_deferreds: [], iras: [], roth_iras: [], hsas: [], command_sequences: [],
        } as Plan)

        const seq = {
            accumulation_ordering_type: 'predefined', withdrawal_ordering_type: 'predefined',
            command_sequence_commands: [
                {id: 1, order: 1, is_active: true, command: {model_name: 'income', model_id: 1, action: 'process'}},
                {id: 2, order: 2, is_active: true, command: {model_name: 'expense', model_id: 1, action: 'process'}},
                {id: 3, order: 3, is_active: true, command: {model_name: 'brokerage', model_id: 1, action: 'invest'}},
                {id: 4, order: 4, is_active: true, command: {model_name: 'brokerage', model_id: 1, action: 'withdraw'}},
                {id: 5, order: 5, is_active: true, command: {model_name: 'cash_reserve', model_id: 1, action: 'invest'}},
                {id: 6, order: 6, is_active: true, command: {model_name: 'cash_reserve', model_id: 1, action: 'withdraw'}},
            ],
        } as any

        plan.simulate(seq)
        const brokerageStates = plan.getManagerById('brokerage', 1).getStates()
        const cashReserveStates = plan.getManagerById('cash_reserve', 1).getStates()
        const brokerageEnd = brokerageStates[brokerageStates.length - 1].balance_end_of_year
        const cashReserveEnd = cashReserveStates[cashReserveStates.length - 1].cash_reserve_end_of_year

        // 40k need: brokerage (30k, no gain so untaxed) is emptied first, then 10k comes from the
        // reserve — leaving the emergency fund half-full, drained last.
        expect(brokerageEnd).toBeCloseTo(0, 4)
        expect(cashReserveEnd).toBeCloseTo(10_000, 4)
    })
})

describe("retired-year debt service draws from savings (#105)", () => {
    it("funds the unmet debt payment from savings and pays down principal", () => {
        // Retires immediately (age == retirement_age), no income, so the retired year's debt payment
        // has no cash and must come from savings.
        const plan = new PlanManager({
            id: 1, name: "Plan", age: 62, year: 2025, inflation_rate: 0,
            growth_application_strategy: 'start', tax_strategy: 'simple', tax_rate: 0, capital_gains_rate: 15,
            life_expectancy: 63, retirement_strategy: 'age', retirement_withdrawal_rate: 4,
            retirement_income_goal: 50000, retirement_age: 62, retirement_savings_amount: 200000,
            retirement_income_adjusted_for_inflation: false,
            incomes: [], expenses: [],
            debts: [{id: 1, name: 'Loan', principal: 20_000, interest_rate: 0, payment_minimum: 5_000, payment_strategy: 'fixed', payment_fixed_amount: 5_000, payment_percentage: 0, frequency: 'annual'}],
            brokerages: [{...emptyBrokerage, initial_balance: 30_000}],
            cash_reserves: [], tax_deferreds: [], iras: [], roth_iras: [], hsas: [], command_sequences: [],
        } as Plan)

        const seq = {
            accumulation_ordering_type: 'predefined', withdrawal_ordering_type: 'predefined',
            command_sequence_commands: [
                {id: 1, order: 1, is_active: true, command: {model_name: 'debt', model_id: 1, action: 'process'}},
                {id: 2, order: 2, is_active: true, command: {model_name: 'brokerage', model_id: 1, action: 'invest'}},
                {id: 3, order: 3, is_active: true, command: {model_name: 'brokerage', model_id: 1, action: 'withdraw'}},
            ],
        } as any

        plan.simulate(seq)
        const debtStates = plan.getManagerById('debt', 1).getStates()
        const brokerageStates = plan.getManagerById('brokerage', 1).getStates()
        const debtEnd = debtStates[debtStates.length - 1]
        const brokerageEnd = brokerageStates[brokerageStates.length - 1]

        // Retired year: 5k debt payment, no cash → 5k from the (gain-free, untaxed) brokerage.
        expect(debtEnd.principal_end_of_year).toBeCloseTo(15_000, 4)
        expect(debtEnd.payment).toBeCloseTo(5_000, 4)
        expect(brokerageEnd.balance_end_of_year).toBeCloseTo(25_000, 4)
    })
})

describe("retirement contributions vs growth", () => {
    it("an account keeps growing but stops contributing once retired", () => {
        const plan = makePlan()
        const brokerage = new BrokerageManager(plan, {
            ...emptyBrokerage, growth_rate: 10, initial_balance: 100_000, contribution_fixed_amount: 5_000,
        })

        // Accumulation year: grow 10% on 100k, then contribute 5k.
        brokerage.process()
        expect(brokerage.getCurrentState().contribution).toBe(5_000)
        expect(brokerage.getCurrentState().balance_end_of_year).toBeCloseTo(115_000, 6)

        // Retire, roll forward, process again: growth continues, contribution stops.
        plan.getCurrentState().retired = true
        brokerage.advanceTimePeriod()
        brokerage.process()
        expect(brokerage.getCurrentState().contribution).toBe(0)
        expect(brokerage.getCurrentState().balance_end_of_year).toBeCloseTo(126_500, 6)
    })
})
