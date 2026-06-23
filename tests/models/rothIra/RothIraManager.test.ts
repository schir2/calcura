import {beforeEach, describe, expect, it} from "vitest";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflation_rate: 3,
    insufficient_funds_strategy: 'none',
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
    expenses: [],
    debts: [],
    tax_deferreds: [],
    iras: [],
    roth_iras: [
        {
            id: 1,
            name: 'Test Roth ',
            growth_rate: 6,
            initial_balance: 10_000,
            contribution_strategy: 'fixed',
            contribution_percentage: 0,
            contribution_fixed_amount: 0,
            income:
                {
                    id: 1,
                    name: 'Ordinary Income',
                    gross_income: 100_000,
                    growth_rate: 0,
                    income_type: "ordinary",
                    frequency: 'annual'
                },

        }
    ],
    brokerages: [],
    hsas: [],
    command_sequences: []
}

let planManager: PlanManager;
let rothIraManager: RothIraManager | undefined;

describe("RothIraManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            assertDefined(rothIraManager, 'RothIraManager')
            const state = rothIraManager.getCurrentState();
            expect(state.contribution).toBe(undefined);
            expect(state.contribution_lifetime).toBe(0);
            expect(state.growth_amount).toBe(undefined);
            expect(state.growth_lifetime).toBe(0);
            expect(state.balance_start_of_year).toBe(10_000);
            expect(state.balance_end_of_year).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateContribution', () => {
        it("fixed", () => {
            planManager = new PlanManager({
                ...planConfig,
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        contribution_strategy: 'fixed',
                        contribution_fixed_amount: 100,
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')
            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("percentage_of_income", () => {
            planManager = new PlanManager({
                ...planConfig,
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        contribution_strategy: 'percentage_of_income',
                        contribution_percentage: 10,
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')

            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });

        it("max", () => {
            planManager = new PlanManager({
                ...planConfig,
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        contribution_strategy: 'max',
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')
            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });
    })

    describe('process', () => {

        it("should process rothIra and update state correctly for start of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 10_000,
                        growth_rate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')
            rothIraManager.process();
            const planState = rothIraManager.orchestrator.getCurrentState();
            const rothIraState = rothIraManager.getCurrentState();

            expect(rothIraState.contribution).toBe(7_000);
            expect(rothIraState.contribution_lifetime).toBe(7_000);
            expect(rothIraState.growth_amount).toBe(1_000);
            expect(rothIraState.growth_lifetime).toBe(1_000);
            expect(rothIraState.balance_start_of_year).toBe(10_000);
            expect(rothIraState.balance_end_of_year).toBe(18_000);
            expect(rothIraState.processed).toBe(true);
            expect(planState.taxable_income).toBe(150_000);
            expect(planState.ira_limit).toBe(0);
            expect(planState.taxable_capital).toBe(140_000);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(98_000);
            expect(planState.savings_taxable_end_of_year).toBe(0);
            expect(planState.savings_tax_deferred_end_of_year).toBe(0);
            expect(planState.savings_tax_exempt_end_of_year).toBe(18_000);
            expect(planState.tax_exempt_contributions).toBe(7_000);
            expect(planState.tax_exempt_contributions_lifetime).toBe(7_000);
            expect(planState.taxed_withdrawals).toBe(7_000);
        });

        it("should process rothIra and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'end',
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 5_000,
                        growth_rate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')

            rothIraManager.process();
            const planState = rothIraManager.orchestrator.getCurrentState();

            const rothIraState = rothIraManager.getCurrentState();

            expect(rothIraState.contribution).toBe(5_000);
            expect(rothIraState.contribution_lifetime).toBe(5_000);
            expect(rothIraState.growth_amount).toBe(1500);
            expect(rothIraState.growth_lifetime).toBe(1500);
            expect(rothIraState.balance_start_of_year).toBe(10_000);
            expect(rothIraState.balance_end_of_year).toBe(16_500);
            expect(rothIraState.processed).toBe(true);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(100_000);
            expect(planState.savings_taxable_end_of_year).toBe(0);
            expect(planState.savings_tax_deferred_end_of_year).toBe(0);
            expect(planState.savings_tax_exempt_end_of_year).toBe(16_500);
            expect(planState.taxed_withdrawals).toBe(5_000);
        });

        it("should throw error if processing already processed state", () => {
            assertDefined(rothIraManager, 'RothIraManager')
            rothIraManager.process();
            expect(() => rothIraManager.process()).toThrow(
                "Failed to process state, it is already processed."
            )
        });

    })

    describe('createNextState', () => {

        it("should process rothIra create the next state", () => {

            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                roth_iras: [
                    {
                        ...planConfig.roth_iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 1_000,
                        growth_rate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('roth_ira',1)
        assertDefined(rothIraManager, 'RothIraManager')
            rothIraManager.process();
            const rothIraState = rothIraManager.getCurrentState();
            const newState = rothIraManager.createNextState(rothIraState);

            expect(newState.contribution).toBe(undefined);
            expect(newState.contribution_lifetime).toBe(1_000);
            expect(newState.growth_amount).toBe(undefined);
            expect(newState.growth_lifetime).toBe(1_000);
            expect(newState.balance_start_of_year).toBe(12_000);
            expect(newState.balance_end_of_year).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
