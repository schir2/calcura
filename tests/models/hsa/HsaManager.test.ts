import {beforeEach, describe, expect, it} from "vitest";
import {HsaManager, calculateHsaContribution} from "~/models/hsa/HsaManager";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: 2024,
    inflation_rate: 3,
    growth_application_strategy: 'start',
    tax_strategy: 'simple',
    tax_rate: 30,
    life_expectancy: 85,
    retirement_strategy: 'age',
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50_000,
    retirement_age: 65,
    retirement_savings_amount: 200_000,
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
            id: 2,
            name: 'Ordinary Income',
            gross_income: 50_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: 'annual'
        }
    ],
    expenses: [],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    hsas: [
        {
            id: 1,
            name: 'Test HSA',
            growth_rate: 6,
            initial_balance: 10_000,
            contribution_strategy: 'fixed',
            contribution_percentage: 0,
            contribution_fixed_amount: 0,
        }
    ],
    command_sequences: [],
}

// year=2024, age=30 → limit = HSA_CONTRIBUTION_LIMIT_2024 * 1.025^0 = 4_150
const HSA_LIMIT = 4_150

let planManager: PlanManager;
let hsaManager: HsaManager;

describe("HsaManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        hsaManager = planManager.getManagerById('hsa', 1)
    });

    describe('constructor', () => {
        it("should initialize with correct state", () => {
            const state = hsaManager.getCurrentState();
            expect(state.contribution).toBe(undefined);
            expect(state.contribution_lifetime).toBe(0);
            expect(state.growth_amount).toBe(undefined);
            expect(state.growth_lifetime).toBe(0);
            expect(state.balance_start_of_year).toBe(10_000);
            expect(state.balance_end_of_year).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateContribution (standalone)', () => {
        it("fixed — returns fixed amount when under limit", () => {
            const result = calculateHsaContribution(
                {...planConfig.hsas[0], contribution_strategy: 'fixed', contribution_fixed_amount: 2_000},
                HSA_LIMIT
            )
            expect(result).toBe(2_000)
        })

        it("fixed — capped at limit when over limit", () => {
            const result = calculateHsaContribution(
                {...planConfig.hsas[0], contribution_strategy: 'fixed', contribution_fixed_amount: 6_000},
                HSA_LIMIT
            )
            expect(result).toBe(HSA_LIMIT)
        })

        it("max — returns full limit", () => {
            const result = calculateHsaContribution(
                {...planConfig.hsas[0], contribution_strategy: 'max'},
                HSA_LIMIT
            )
            expect(result).toBe(HSA_LIMIT)
        })

        it("percentage_of_income — returns 0 (unsupported strategy)", () => {
            const result = calculateHsaContribution(
                {...planConfig.hsas[0], contribution_strategy: 'percentage_of_income'},
                HSA_LIMIT
            )
            expect(result).toBe(0)
        })
    })

    describe('calculateContribution (via manager)', () => {
        it("fixed", () => {
            planManager = new PlanManager({
                ...planConfig,
                hsas: [{...planConfig.hsas[0], contribution_strategy: 'fixed', contribution_fixed_amount: 3_000}]
            })
            hsaManager = planManager.getManagerById('hsa', 1)
            expect(hsaManager.calculateContribution()).toBe(3_000)
        })

        it("max — capped at plan-year limit", () => {
            planManager = new PlanManager({
                ...planConfig,
                hsas: [{...planConfig.hsas[0], contribution_strategy: 'max'}]
            })
            hsaManager = planManager.getManagerById('hsa', 1)
            expect(hsaManager.calculateContribution()).toBe(HSA_LIMIT)
        })
    })

    describe('process', () => {
        it("should process HSA and update state correctly for start-of-year growth strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                hsas: [{
                    ...planConfig.hsas[0],
                    initial_balance: 10_000,
                    contribution_fixed_amount: 3_000,
                    growth_rate: 10,
                }]
            })
            hsaManager = planManager.getManagerById('hsa', 1)
            hsaManager.process()

            const hsaState = hsaManager.getCurrentState()
            const planState = planManager.getCurrentState()

            // growth = 10_000 * 10% = 1_000 (start: growth on initial balance only)
            expect(hsaState.contribution).toBe(3_000)
            expect(hsaState.contribution_lifetime).toBe(3_000)
            expect(hsaState.growth_amount).toBe(1_000)
            expect(hsaState.growth_lifetime).toBe(1_000)
            expect(hsaState.balance_start_of_year).toBe(10_000)
            expect(hsaState.balance_end_of_year).toBe(14_000)
            expect(hsaState.processed).toBe(true)

            // 3_000 withdrawn pre-tax: taxable reduced from 150_000 → 147_000
            expect(planState.income.taxable).toBe(147_000)
            expect(planState.assets.tax_deferred.contribution).toBe(3_000)
            expect(planState.assets.tax_deferred.balance_end).toBe(4_000)
            expect(planState.limits.hsa).toBe(HSA_LIMIT - 3_000)
        })

        it("should process HSA and update state correctly for end-of-year growth strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'end',
                hsas: [{
                    ...planConfig.hsas[0],
                    initial_balance: 10_000,
                    contribution_fixed_amount: 3_000,
                    growth_rate: 10,
                }]
            })
            hsaManager = planManager.getManagerById('hsa', 1)
            hsaManager.process()

            const hsaState = hsaManager.getCurrentState()

            // growth = (10_000 + 3_000) * 10% = 1_300 (end: growth on balance + contribution)
            expect(hsaState.contribution).toBe(3_000)
            expect(hsaState.growth_amount).toBe(1_300)
            expect(hsaState.balance_end_of_year).toBe(14_300)
        })

        it("should throw if processed twice", () => {
            hsaManager.process()
            expect(() => hsaManager.process()).toThrow("Failed to process state, it is already processed.")
        })
    })

    describe('createNextState', () => {
        it("should transition to next state from processed state", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                hsas: [{
                    ...planConfig.hsas[0],
                    initial_balance: 10_000,
                    contribution_fixed_amount: 1_000,
                    growth_rate: 10,
                }]
            })
            hsaManager = planManager.getManagerById('hsa', 1)
            hsaManager.process()

            // growth = 10_000 * 10% = 1_000, balance_end = 12_000
            const processed = hsaManager.getCurrentState()
            const next = hsaManager.createNextState(processed)

            expect(next.contribution).toBe(undefined)
            expect(next.contribution_lifetime).toBe(1_000)
            expect(next.growth_amount).toBe(undefined)
            expect(next.growth_lifetime).toBe(1_000)
            expect(next.balance_start_of_year).toBe(12_000)
            expect(next.balance_end_of_year).toBe(undefined)
            expect(next.processed).toBe(false)
        })
    })
})