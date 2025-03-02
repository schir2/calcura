import {beforeEach, describe, expect, it} from "vitest";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import {RothIraContributionStrategy} from "~/types/RothIra";
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
    cashReserve: [],
    income: [
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
    taxDeferred: [],
    ira: [],
    rothIra: [
        {
            id: 1,
            name: 'Test Roth ',
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
    brokerage: [],
    commandSequences: []
}

let planManager: PlanManager;
let rothIraManager: RothIraManager | undefined;

describe("RothIraManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            assertDefined(rothIraManager, 'RothIraManager')
            const state = rothIraManager.getCurrentState();
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
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        contributionStrategy: RothIraContributionStrategy.Fixed,
                        contributionFixedAmount: 100,
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')
            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("percentage_of_income", () => {
            planManager = new PlanManager({
                ...planConfig,
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        contributionStrategy: RothIraContributionStrategy.PercentageOfIncome,
                        contributionPercentage: 10,
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')

            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });

        it("max", () => {
            planManager = new PlanManager({
                ...planConfig,
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        contributionStrategy: RothIraContributionStrategy.Max,
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')
            const contribution = rothIraManager.calculateContribution();
            expect(contribution).toBe(7_000);
        });
    })

    describe('process', () => {

        it("should process rothIra and update state correctly for start of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 10_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')
            rothIraManager.process();
            const planState = rothIraManager.orchestrator.getCurrentState();
            const rothIraState = rothIraManager.getCurrentState();

            expect(rothIraState.contribution).toBe(7_000);
            expect(rothIraState.contributionLifetime).toBe(7_000);
            expect(rothIraState.growthAmount).toBe(1_000);
            expect(rothIraState.growthLifetime).toBe(1_000);
            expect(rothIraState.balanceStartOfYear).toBe(10_000);
            expect(rothIraState.balanceEndOfYear).toBe(18_000);
            expect(rothIraState.processed).toBe(true);
            expect(planState.taxableIncome).toBe(150_000);
            expect(planState.iraLimit).toBe(0);
            expect(planState.taxableCapital).toBe(140_000);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(98_000);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxExemptEndOfYear).toBe(18_000);
            expect(planState.taxExemptContributions).toBe(7_000);
            expect(planState.taxExemptContributionsLifetime).toBe(7_000);
            expect(planState.taxedWithdrawals).toBe(7_000);
        });

        it("should process rothIra and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: GrowthApplicationStrategy.End,
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 5_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')

            rothIraManager.process();
            const planState = rothIraManager.orchestrator.getCurrentState();

            const rothIraState = rothIraManager.getCurrentState();

            expect(rothIraState.contribution).toBe(5_000);
            expect(rothIraState.contributionLifetime).toBe(5_000);
            expect(rothIraState.growthAmount).toBe(1500);
            expect(rothIraState.growthLifetime).toBe(1500);
            expect(rothIraState.balanceStartOfYear).toBe(10_000);
            expect(rothIraState.balanceEndOfYear).toBe(16_500);
            expect(rothIraState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(100_000);
            expect(planState.savingsTaxableEndOfYear).toBe(0);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxExemptEndOfYear).toBe(16_500);
            expect(planState.taxedWithdrawals).toBe(5_000);
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
                growthApplicationStrategy: GrowthApplicationStrategy.Start,
                rothIra: [
                    {
                        ...planConfig.rothIra[0],
                        initialBalance: 10_000,
                        contributionFixedAmount: 1_000,
                        growthRate: 10
                    }
                ]
            })

        rothIraManager = planManager.getManagerById<RothIraManager>('rothIra',1)
        assertDefined(rothIraManager, 'RothIraManager')
            rothIraManager.process();
            const rothIraState = rothIraManager.getCurrentState();
            const newState = rothIraManager.createNextState(rothIraState);

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
