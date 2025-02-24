import {beforeEach, describe, expect, it} from "vitest";
import {RothIraInvestmentManager} from "~/models/rothIraInvestment/RothIraInvestmentManager";
import {RothIraContributionStrategy} from "~/types/RothIraInvestment";
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
    inflationRate: 3,
    growthRate: 6,
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
    cashReserves: [],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 100_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: Frequency.Annually
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: Frequency.Annually
        }
    ],
    expenses: [],
    debts: [],
    taxDeferredInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [
        {
            id: 1,
            name: 'Test Roth Investment',
            growthRate: 6,
            initialBalance: 10_000,
            contributionStrategy: RothIraContributionStrategy.Fixed,
            contributionPercentage: 0,
            contributionFixedAmount: 0,
            income:
                {
                    id: 1,
                    name: 'Ordinary Income',
                    grossIncome: 100_000,
                    growthRate: 0,
                    incomeType: "ordinary",
                    frequency: Frequency.Annually
                },

        }
    ],
    brokerageInvestments: [],
}

let planManager: PlanManager;
let rothIraInvestmentManager: RothIraInvestmentManager | undefined;

describe("RothIraInvestmentManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            const state = rothIraInvestmentManager.getCurrentState();
            expect(state.contribution).toBe(undefined);
            expect(state.contributionLifetime).toBe(0);
            expect(state.growthAmount).toBe(undefined);
            expect(state.growthLifetime).toBe(0);
            expect(state.balanceStartOfYear).toBe(10_000);
            expect(state.balanceEndOfYear).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateContribution', () => {
        it("fixed", () => {
            planManager = new PlanManager({
                ...planConfig,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        contributionStrategy: RothIraContributionStrategy.Fixed,
                        contributionFixedAmount: 100,
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            const contribution = rothIraInvestmentManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("percentage_of_income", () => {
            planManager = new PlanManager({
                ...planConfig,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        contributionStrategy: RothIraContributionStrategy.PercentageOfIncome,
                        contributionPercentage: 10,
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')

            const contribution = rothIraInvestmentManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });

        it("max", () => {
            planManager = new PlanManager({
                ...planConfig,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        contributionStrategy: RothIraContributionStrategy.Max,
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            const contribution = rothIraInvestmentManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });
    })

    describe('process', () => {

        it("should process rothIraInvestment and update state correctly for start of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 10_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            rothIraInvestmentManager.process();
            const planState = rothIraInvestmentManager.orchestrator.getCurrentState();
            const rothIraInvestmentState = rothIraInvestmentManager.getCurrentState();

            expect(rothIraInvestmentState.contribution).toBe(7_000);
            expect(rothIraInvestmentState.contributionLifetime).toBe(7_000);
            expect(rothIraInvestmentState.growthAmount).toBe(1_000);
            expect(rothIraInvestmentState.growthLifetime).toBe(1_000);
            expect(rothIraInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(rothIraInvestmentState.balanceEndOfYear).toBe(18_000);
            expect(rothIraInvestmentState.processed).toBe(true);
            expect(planState.taxableIncome).toBe(150_000);
            expect(planState.iraLimit).toBe(0);
            expect(planState.taxableCapital).toBe(150_000);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(98_000);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxExemptEndOfYear).toBe(18_000);
            expect(planState.taxExemptContributions).toBe(7_000);
            expect(planState.taxExemptContributionsLifetime).toBe(7_000);
            expect(planState.taxedWithdrawals).toBe(7_000);
        });

        it("should process rothIraInvestment and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.End,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 5_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')

            rothIraInvestmentManager.process();
            const planState = rothIraInvestmentManager.orchestrator.getCurrentState();

            const rothIraInvestmentState = rothIraInvestmentManager.getCurrentState();

            expect(rothIraInvestmentState.contribution).toBe(5_000);
            expect(rothIraInvestmentState.contributionLifetime).toBe(5_000);
            expect(rothIraInvestmentState.growthAmount).toBe(1500);
            expect(rothIraInvestmentState.growthLifetime).toBe(1500);
            expect(rothIraInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(rothIraInvestmentState.balanceEndOfYear).toBe(16_500);
            expect(rothIraInvestmentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(100_000);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxExemptEndOfYear).toBe(16_500);
            expect(planState.taxedWithdrawals).toBe(5_000);
        });

        it("should throw error if processing already processed state", () => {
            assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            rothIraInvestmentManager.process();
            expect(() => rothIraInvestmentManager.process()).toThrow(
                "Failed to process state, it is already processed."
            )
        });

    })

    describe('createNextState', () => {

        it("should process rothIraInvestment create the next state", () => {

            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                rothIraInvestments: [
                    {
                        ...planConfig.rothIraInvestments[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 1_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraInvestmentManager = planManager.getManagerById<RothIraInvestmentManager>('rothIraInvestmentManagers',1)
        assertDefined(rothIraInvestmentManager, 'RothIraInvestmentManager')
            rothIraInvestmentManager.process();
            const rothIraInvestmentState = rothIraInvestmentManager.getCurrentState();
            const newState = rothIraInvestmentManager.createNextState(rothIraInvestmentState);

            expect(newState.contribution).toBe(undefined);
            expect(newState.contributionLifetime).toBe(1_000);
            expect(newState.growthAmount).toBe(undefined);
            expect(newState.growthLifetime).toBe(1_000);
            expect(newState.balanceStartOfYear).toBe(12_000);
            expect(newState.balanceEndOfYear).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
