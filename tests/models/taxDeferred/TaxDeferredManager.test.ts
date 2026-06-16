import {beforeEach, describe, expect, it} from "vitest";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
import {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/types/TaxDeferred";
import PlanManager from "~/models/plan/PlanManager";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/types/Plan";

import {Frequency} from "~/types/Frequency";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflation_rate: 3,
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
    cash_reserves: [],
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
            elective_contribution_strategy: TaxDeferredContributionStrategy.PercentageOfIncome,
            elective_contribution_percentage: 10,
            elective_contribution_fixed_amount: 0,
            employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
            employer_contribution_match_percentage: 100,
            employer_contribution_fixed_amount: 0,
            employer_match_percentage_limit: 5,
            employer_match_percentage: 50,
            income: {
                id: 1,
                name: 'Ordinary Income',
                gross_income: 100_000,
                growth_rate: 0,
                income_type: "ordinary",
                frequency: Frequency.Annually
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
        taxDeferredManager = planManager.getManagerById('taxDeferred', 1)
        assertDefined(taxDeferredManager, 'TaxDeferredManager')
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const state = taxDeferredManager.getCurrentState();
            expect(state.contribution).toBe(undefined);
            expect(state.contributionLifetime).toBe(0);
            expect(state.electiveContribution).toBe(undefined);
            expect(state.electiveContributionLifetime).toBe(0);
            expect(state.employerContribution).toBe(undefined);
            expect(state.employerContributionLifetime).toBe(0);
            expect(state.growthAmount).toBe(undefined);
            expect(state.growthLifetime).toBe(0);
            expect(state.balanceStartOfYear).toBe(10_000);
            expect(state.balanceEndOfYear).toBe(undefined);
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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.Fixed,
                        elective_contribution_fixed_amount: 100,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.PercentageOfIncome,
                        elective_contribution_percentage: 10,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.Max,
                        elective_contribution_percentage: 10,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        employer_contribution_match_percentage: 0,
                        employer_match_percentage: 100,
                        employer_match_percentage_limit: 3,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        employer_contribution_strategy: EmployerContributionStrategy.Fixed,
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfCompensation,
                        employer_contribution_match_percentage: 5,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        employer_contribution_strategy: EmployerContributionStrategy.None,
                        employer_contribution_match_percentage: 100,
                        employer_match_percentage_limit: 3,
                        employer_match_percentage: 50,
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        elective_contribution_strategy: TaxDeferredContributionStrategy.Fixed,
                        elective_contribution_fixed_amount: 1_500,
                        employer_contribution_match_percentage: 100,
                        employer_match_percentage_limit: 3,
                        employer_match_percentage: 50,
                        employer_contribution_fixed_amount: 10_000,
                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        employer_contribution_match_percentage: 0,
                        employer_match_percentage: 0,
                        employer_match_percentage_limit: 3,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)

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
                        elective_contribution_strategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        employer_contribution_match_percentage: 0,
                        employer_match_percentage: 100,
                        employer_match_percentage_limit: 0,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferred', 1)
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
                    growth_application_strategy: GrowthApplicationStrategy.Start,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        growth_rate: 6,
                        elective_contribution_strategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        employer_match_percentage: 50,
                        employer_match_percentage_limit: 6,

                    }]
                }
            )
            taxDeferredManager = planManager.getManagerById('taxDeferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            const planState = taxDeferredManager.orchestrator.getCurrentState();
            const taxDeferredState = taxDeferredManager.getCurrentState();

            expect(taxDeferredState.contribution).toBe(18_000);
            expect(taxDeferredState.contributionLifetime).toBe(18_000);
            expect(taxDeferredState.electiveContribution).toBe(12_000);
            expect(taxDeferredState.electiveContributionLifetime).toBe(12_000);
            expect(taxDeferredState.employerContribution).toBe(6_000);
            expect(taxDeferredState.employerContributionLifetime).toBe(6_000);
            expect(taxDeferredState.growthAmount).toBe(600);
            expect(taxDeferredState.growthLifetime).toBe(600);
            expect(taxDeferredState.balanceStartOfYear).toBe(10_000);
            expect(taxDeferredState.balanceEndOfYear).toBe(28_600);
            expect(taxDeferredState.processed).toBe(true);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(28_600);
            expect(planState.taxedIncome).toBe(96_600);
            expect(planState.taxedCapital).toBe(96_600);
            expect(planState.taxedWithdrawals).toBe(0);
        });

        it("should process taxDeferred and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    growth_application_strategy: GrowthApplicationStrategy.End,
                    tax_deferreds: [{
                        ...planConfig.tax_deferreds[0],
                        growth_rate: 6,
                        elective_contribution_strategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        elective_contribution_percentage: 100,
                        employer_contribution_strategy: EmployerContributionStrategy.PercentageOfContribution,
                        employer_match_percentage: 50,
                        employer_match_percentage_limit: 6,

                    }]
                }
            )
            taxDeferredManager = planManager.getManagerById('taxDeferred', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            taxDeferredManager.process();
            const planState = taxDeferredManager.orchestrator.getCurrentState();
            const taxDeferredState = taxDeferredManager.getCurrentState();

            expect(taxDeferredState.electiveContribution).toBe(12_000);
            expect(taxDeferredState.electiveContributionLifetime).toBe(12_000);
            expect(taxDeferredState.employerContribution).toBe(6_000);
            expect(taxDeferredState.employerContributionLifetime).toBe(6_000);
            expect(taxDeferredState.growthAmount).toBe(1680);
            expect(taxDeferredState.growthLifetime).toBe(1680);
            expect(taxDeferredState.balanceStartOfYear).toBe(10_000);
            +
                expect(taxDeferredState.balanceEndOfYear).toBe(29_680);
            expect(taxDeferredState.processed).toBe(true);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(29_680);
            expect(planState.taxedIncome).toBe(96_600);
            expect(planState.taxedCapital).toBe(96_600);
            expect(planState.taxedWithdrawals).toBe(0);
        });

        it("should throw error if processing already processed state", () => {
            const taxDeferredManager = planManager.getManagerById('taxDeferred', 1)
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
            expect(newState.electiveContribution).toBe(undefined);
            expect(newState.electiveContributionLifetime).toBe(10_000);
            expect(newState.employerContribution).toBe(undefined);
            expect(newState.employerContributionLifetime).toBe(5_000);
            expect(newState.growthAmount).toBe(undefined);
            expect(newState.growthLifetime).toBe(600);
            expect(newState.balanceStartOfYear).toBe(25_600);
            expect(newState.balanceEndOfYear).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
