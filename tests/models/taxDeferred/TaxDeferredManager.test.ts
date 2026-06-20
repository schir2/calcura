import {beforeEach, describe, expect, it} from "vitest";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
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
    brokerages: [],
    roth_iras: [],
    tax_deferreds: [
        {
            id: 1,
            name: 'Test TaxDeferred ',
            growth_rate: 6,
            initial_balance: 10_000,
            elective_contribution_strategy: 'percentage_of_income',
            elective_contribution_percentage: 10,
            elective_contribution_fixed_amount: 0,
            employer_contribution_strategy: 'percentage_of_contribution',
            employer_compensation_match_percentage: 100,
            employer_contribution_fixed_amount: 0,
            employer_match_percentage_limit: 5,
            employer_match_percentage: 50,
            income: {
                id: 1,
                name: 'Ordinary Income',
                gross_income: 100_000,
                growth_rate: 0,
                income_type: "ordinary",
                frequency: 'annual'
            }

        }
    ],
    iras: [],
    command_sequences: [],
}


let planManager: PlanManager;
let taxDeferredManager: TaxDeferredManager | undefined;

describe("TaxDeferredManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        taxDeferredManager = planManager.getManagerById('tax_deferred', 1)
        assertDefined(taxDeferredManager, 'TaxDeferredManager')
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const state = taxDeferredManager.getCurrentState();
            expect(state.contribution).toBe(undefined);
            expect(state.contribution_lifetime).toBe(0);
            expect(state.elective_contribution).toBe(undefined);
            expect(state.elective_contribution_lifetime).toBe(0);
            expect(state.employer_contribution).toBe(undefined);
            expect(state.employer_contribution_lifetime).toBe(0);
            expect(state.growth_amount).toBe(undefined);
            expect(state.growth_lifetime).toBe(0);
            expect(state.balance_start_of_year).toBe(10_000);
            expect(state.balance_end_of_year).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateElectiveContribution', () => {
        it("should calculate fixed contribution correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'fixed',
                        elective_contribution_fixed_amount: 100,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(100);
        });

        it("should calculate percentage of income correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'percentage_of_income',
                        elective_contribution_percentage: 10,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(10_000);
        });

        it("should calculate max electiveContribution correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'max',
                        elective_contribution_percentage: 10,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(Infinity);
        });

        it("should calculate employer_match electiveContribution correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'until_company_match',
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: 'percentage_of_contribution',
                        employer_compensation_match_percentage: 0,
                        employer_match_percentage: 100,
                        employer_match_percentage_limit: 3,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(3_000);
        });
    })

    describe('calculateEmployerContribution', () => {
        it("fixed", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        employer_contribution_strategy: 'fixed',
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(10_000);
        });

        it("percentage of compensation", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        employer_contribution_strategy: 'percentage_of_compensation',
                        employer_compensation_match_percentage: 5,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(5_000);
        });

        it("none", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        employer_contribution_strategy: 'none',
                        employer_compensation_match_percentage: 100,
                        employer_match_percentage_limit: 3,
                        employer_match_percentage: 50,
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(0);
        });

        it("percentage of contribution", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        employer_contribution_strategy: 'percentage_of_contribution',
                        elective_contribution_strategy: 'fixed',
                        elective_contribution_fixed_amount: 1_500,
                        employer_compensation_match_percentage: 100,
                        employer_match_percentage_limit: 3,
                        employer_match_percentage: 50,
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(750);
        });

        it("percentage of contribution match percentage is 0", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'until_company_match',
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: 'percentage_of_contribution',
                        employer_compensation_match_percentage: 0,
                        employer_match_percentage: 0,
                        employer_match_percentage_limit: 3,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)

            expect(() => {
                assertDefined(taxDeferredManager, 'TaxDeferredManager')
                taxDeferredManager.calculateEmployerContribution();
            }).toThrow('Employer match percentage must be greater than 0');
        });

        it("percentage of contribution match limit is 0", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        elective_contribution_strategy: 'until_company_match',
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: 'percentage_of_contribution',
                        employer_compensation_match_percentage: 0,
                        employer_match_percentage: 100,
                        employer_match_percentage_limit: 0,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(0);
        });
    })

    describe('process', () => {

        it("should process taxDeferred and update state correctly for start of year application strategy", () => {

            planManager = new PlanManager(
                {
                    ...planConfig,
                    growth_application_strategy: 'start',
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        growth_rate: 6,
                        elective_contribution_strategy: 'until_company_match',
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: 'percentage_of_contribution',
                        employer_match_percentage: 50,
                        employer_match_percentage_limit: 6,

                    }]
                }
            )
            taxDeferredManager = planManager.getManagerById('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            const planState = taxDeferredManager.orchestrator.getCurrentState();
            const taxDeferredState = taxDeferredManager.getCurrentState();

            expect(taxDeferredState.contribution).toBe(18_000);
            expect(taxDeferredState.contribution_lifetime).toBe(18_000);
            expect(taxDeferredState.elective_contribution).toBe(12_000);
            expect(taxDeferredState.elective_contribution_lifetime).toBe(12_000);
            expect(taxDeferredState.employer_contribution).toBe(6_000);
            expect(taxDeferredState.employer_contribution_lifetime).toBe(6_000);
            expect(taxDeferredState.growth_amount).toBe(600);
            expect(taxDeferredState.growth_lifetime).toBe(600);
            expect(taxDeferredState.balance_start_of_year).toBe(10_000);
            expect(taxDeferredState.balance_end_of_year).toBe(28_600);
            expect(taxDeferredState.processed).toBe(true);
            expect(planState.savings_tax_deferred_end_of_year).toBe(28_600);
            expect(planState.taxed_income).toBe(96_600);
            expect(planState.taxed_capital).toBe(96_600);
            expect(planState.taxed_withdrawals).toBe(0);
        });

        it("should process taxDeferred and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    growth_application_strategy: 'end',
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        growth_rate: 6,
                        elective_contribution_strategy: 'until_company_match',
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: 'percentage_of_contribution',
                        employer_match_percentage: 50,
                        employer_match_percentage_limit: 6,

                    }]
                }
            )
            taxDeferredManager = planManager.getManagerById('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            const planState = taxDeferredManager.orchestrator.getCurrentState();
            const taxDeferredState = taxDeferredManager.getCurrentState();

            expect(taxDeferredState.elective_contribution).toBe(12_000);
            expect(taxDeferredState.elective_contribution_lifetime).toBe(12_000);
            expect(taxDeferredState.employer_contribution).toBe(6_000);
            expect(taxDeferredState.employer_contribution_lifetime).toBe(6_000);
            expect(taxDeferredState.growth_amount).toBe(1680);
            expect(taxDeferredState.growth_lifetime).toBe(1680);
            expect(taxDeferredState.balance_start_of_year).toBe(10_000);
            +
                expect(taxDeferredState.balance_end_of_year).toBe(29_680);
            expect(taxDeferredState.processed).toBe(true);
            expect(planState.savings_tax_deferred_end_of_year).toBe(29_680);
            expect(planState.taxed_income).toBe(96_600);
            expect(planState.taxed_capital).toBe(96_600);
            expect(planState.taxed_withdrawals).toBe(0);
        });

        it("should throw error if processing already processed state", () => {
            const taxDeferredManager = planManager.getManagerById('tax_deferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            expect(() => taxDeferredManager.process()).toThrow(
                "Failed to process state, it is already processed."
            );
        });

    })


    describe('createNextState', () => {

        it("should process taxDeferred create the next state", () => {
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            const taxDeferredState = taxDeferredManager.getCurrentState();
            const newState = taxDeferredManager.createNextState(taxDeferredState);
            expect(newState.elective_contribution).toBe(undefined);
            expect(newState.elective_contribution_lifetime).toBe(10_000);
            expect(newState.employer_contribution).toBe(undefined);
            expect(newState.employer_contribution_lifetime).toBe(5_000);
            expect(newState.growth_amount).toBe(undefined);
            expect(newState.growth_lifetime).toBe(600);
            expect(newState.balance_start_of_year).toBe(25_600);
            expect(newState.balance_end_of_year).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
