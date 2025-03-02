import {beforeEach, describe, expect, it} from "vitest";
import {IraIManager} from "~/models/ira/IraIManager";
import {IraContributionStrategy} from "~/types/Ira";
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
    retirementIncomeAdjustedForInflation: true,
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
    taxDeferreds: [],
    iras: [
        {
            id: 1,
            name: 'Test Brokerage ',
            growthRate: 6,
            initialBalance: 10_000,
            contributionStrategy: IraContributionStrategy.Fixed,
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
    brokerages: [],
    rothIras: [],
    commandSequences: [],
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
                iras: [
                    {
                        ...planConfig.iras[0],
                        contributionStrategy: IraContributionStrategy.Fixed,
                        contributionFixedAmount: 100,
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
                        contributionStrategy: IraContributionStrategy.PercentageOfIncome,
                        contributionPercentage: 10,
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
                        contributionStrategy: IraContributionStrategy.Max,
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
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                iras: [
                    {
                        ...planConfig.iras[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 10_000,
                        growthRate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            iraManager.process();
            const planState = iraManager.orchestrator.getCurrentState();
            const iraState = iraManager.getCurrentState();

            expect(iraState.contribution).toBe(7_000);
            expect(iraState.contributionLifetime).toBe(7_000);
            expect(iraState.growthAmount).toBe(1_000);
            expect(iraState.growthLifetime).toBe(1_000);
            expect(iraState.balanceStartOfYear).toBe(10_000);
            expect(iraState.balanceEndOfYear).toBe(18_000);
            expect(iraState.processed).toBe(true);
            expect(planState.taxableIncome).toBe(143_000);
            expect(planState.taxableCapital).toBe(143_000);
            expect(planState.taxedIncome).toBe(100_100);
            expect(planState.taxedCapital).toBe(100_100);
            expect(planState.taxDeferredContributions).toBe(7_000);
            expect(planState.taxDeferredContributionsLifetime).toBe(7_000);
            expect(planState.iraLimit).toBe(0);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(18_000);
            expect(planState.savingsTaxExemptEndOfYear).toBe(0);
            expect(planState.taxedWithdrawals).toBe(0);
        });

        it("should process ira and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.End,
                iras: [
                    {
                        ...planConfig.iras[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 5_000,
                        growthRate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)

            iraManager.process();
            const planState = iraManager.orchestrator.getCurrentState();

            const iraState = iraManager.getCurrentState();

            expect(iraState.contribution).toBe(5_000);
            expect(iraState.contributionLifetime).toBe(5_000);
            expect(iraState.growthAmount).toBe(1500);
            expect(iraState.growthLifetime).toBe(1500);
            expect(iraState.balanceStartOfYear).toBe(10_000);
            expect(iraState.balanceEndOfYear).toBe(16_500);
            expect(iraState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(101_500);
            expect(planState.taxedCapital).toBe(101_500);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.iraLimit).toBe(2_000);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(16_500);
            expect(planState.savingsTaxExemptEndOfYear).toBe(0);
            expect(planState.taxedWithdrawals).toBe(0);
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
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                iras: [
                    {
                        ...planConfig.iras[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 1_000,
                        growthRate: 10
                    }
                ]
            })
            iraManager = planManager.getManagerById('ira', 1)
            iraManager.process();
            const iraState = iraManager.getCurrentState();
            const newState = iraManager.createNextState(iraState);

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
