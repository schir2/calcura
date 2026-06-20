import {beforeEach, describe, expect, it} from "vitest";
import {IraIManager} from "~/models/ira/IraIManager";
import PlanManager from "~/models/plan/PlanManager";
import type {Plan} from "#shared/types/Plan";

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
    iras: [
        {
            id: 1,
            name: 'Test Brokerage ',
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
    roth_iras: [],
    command_sequences: [],
}

let planManager: PlanManager;
let iraManager: IraIManager;

describe("IraManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        iraManager = planManager.getManagerById('ira', 1)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const state = iraManager.getCurrentState();
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
                iras: [
                    {
                        ...planConfig.iras[0],
                        contribution_strategy: 'fixed',
                        contribution_fixed_amount: 100,
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            const contribution = iraManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("percentage_of_income", () => {
            planManager = new PlanManager({
                ...planConfig,
                iras: [
                    {
                        ...planConfig.iras[0],
                        contribution_strategy: 'percentage_of_income',
                        contribution_percentage: 10,
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)

            const contribution = iraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });

        it("max", () => {
            planManager = new PlanManager({
                ...planConfig,
                iras: [
                    {
                        ...planConfig.iras[0],
                        contribution_strategy: 'max',
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            const contribution = iraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });
    })

    describe('process', () => {

        it("should process ira and update state correctly for start of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                iras: [
                    {
                        ...planConfig.iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 10_000,
                        growth_rate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            iraManager.process();
            const planState = iraManager.orchestrator.getCurrentState();
            const iraState = iraManager.getCurrentState();

            expect(iraState.contribution).toBe(7_000);
            expect(iraState.contribution_lifetime).toBe(7_000);
            expect(iraState.growth_amount).toBe(1_000);
            expect(iraState.growth_lifetime).toBe(1_000);
            expect(iraState.balance_start_of_year).toBe(10_000);
            expect(iraState.balance_end_of_year).toBe(18_000);
            expect(iraState.processed).toBe(true);
            expect(planState.taxable_income).toBe(143_000);
            expect(planState.taxable_capital).toBe(143_000);
            expect(planState.taxed_income).toBe(100_100);
            expect(planState.taxed_capital).toBe(100_100);
            expect(planState.tax_deferred_contributions).toBe(7_000);
            expect(planState.tax_deferred_contributions_lifetime).toBe(7_000);
            expect(planState.ira_limit).toBe(0);
            expect(planState.savings_taxable_end_of_year).toBe(0);
            expect(planState.savings_tax_deferred_end_of_year).toBe(18_000);
            expect(planState.savings_tax_exempt_end_of_year).toBe(0);
            expect(planState.taxed_withdrawals).toBe(0);
        });

        it("should process ira and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'end',
                iras: [
                    {
                        ...planConfig.iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 5_000,
                        growth_rate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)

            iraManager.process();
            const planState = iraManager.orchestrator.getCurrentState();

            const iraState = iraManager.getCurrentState();

            expect(iraState.contribution).toBe(5_000);
            expect(iraState.contribution_lifetime).toBe(5_000);
            expect(iraState.growth_amount).toBe(1500);
            expect(iraState.growth_lifetime).toBe(1500);
            expect(iraState.balance_start_of_year).toBe(10_000);
            expect(iraState.balance_end_of_year).toBe(16_500);
            expect(iraState.processed).toBe(true);
            expect(planState.taxed_income).toBe(101_500);
            expect(planState.taxed_capital).toBe(101_500);
            expect(planState.savings_taxable_end_of_year).toBe(0);
            expect(planState.ira_limit).toBe(2_000);
            expect(planState.savings_tax_deferred_end_of_year).toBe(16_500);
            expect(planState.savings_tax_exempt_end_of_year).toBe(0);
            expect(planState.taxed_withdrawals).toBe(0);
        });

        it("should throw error if processing already processed state", () => {
            iraManager.process();
            expect(() => iraManager.process()).toThrow(
                "Failed to process state, it is already processed."
            )
        });

    })

    describe('createNextState', () => {

        it("should process ira create the next state", () => {

            planManager = new PlanManager({
                ...planConfig,
                growth_application_strategy: 'start',
                iras: [
                    {
                        ...planConfig.iras[0],
                        initial_balance: 10_000,
                        contribution_fixed_amount: 1_000,
                        growth_rate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            iraManager.process();
            const iraState = iraManager.getCurrentState();
            const newState = iraManager.createNextState(iraState);

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
