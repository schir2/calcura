import {beforeEach, describe, expect, it} from "vitest";
import {BrokerageManager} from "~/models/brokerage/BrokerageManager";
import type {Brokerage} from "~/types/Brokerage";
import {BrokerageContributionStrategy} from "~/types/Brokerage";
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
    brokerage: [],
    ira: [],
    rothIra: [],
    commandSequences: [],
}

const brokerage: Brokerage = {
    id: 1,
    name: 'Test Brokerage ',
    growthRate: 6,
    initialBalance: 10_000,
    contributionStrategy: BrokerageContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,

};

let planManager: PlanManager;

describe("BrokerageManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const brokerageManager = new BrokerageManager(planManager, brokerage);
            const state = brokerageManager.getCurrentState();
            expect(state.contribution).toBe(0);
            expect(state.contributionLifetime).toBe(0);
            expect(state.growthAmount).toBe(0);
            expect(state.growthLifetime).toBe(0);
            expect(state.balanceStartOfYear).toBe(10_000);
            expect(state.balanceEndOfYear).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateContribution', () => {
        it("should calculate fixed contribution correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contributionStrategy: BrokerageContributionStrategy.Fixed,
                contributionFixedAmount: 100,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("should calculate percentage income correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contributionStrategy: BrokerageContributionStrategy.PercentageOfIncome,
                contributionPercentage: 10,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(15_000);
        });

        it("should calculate max contribution correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contributionStrategy: BrokerageContributionStrategy.Max,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(105_000);
        });
    })

    describe('process', () => {

        it("should process brokerage and update state correctly for start of year application strategy", () => {
            const brokerageConfig = {
                ...brokerage,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.Start, brokerage: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const planState = brokerageManager.orchestrator.getCurrentState();
            const brokerageState = brokerageManager.getCurrentState();

            expect(brokerageState.contribution).toBe(1_000);
            expect(brokerageState.contributionLifetime).toBe(1_000);
            expect(brokerageState.growthAmount).toBe(1_000);
            expect(brokerageState.growthLifetime).toBe(1_000);
            expect(brokerageState.balanceStartOfYear).toBe(10_000);
            expect(brokerageState.balanceEndOfYear).toBe(12_000);
            expect(brokerageState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.taxableContributions).toBe(1_000);
            expect(planState.taxableContributionsLifetime).toBe(1_000);
            expect(planState.savingsTaxableEndOfYear).toBe(12_000);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should process brokerage and update state correctly for end of of year application strategy", () => {
            const brokerageConfig = {
                ...brokerage,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.End, brokerage: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const planState = brokerageManager.orchestrator.getCurrentState();

            const brokerageState = brokerageManager.getCurrentState();

            expect(brokerageState.contribution).toBe(1_000);
            expect(brokerageState.contributionLifetime).toBe(1_000);
            expect(brokerageState.growthAmount).toBe(1100);
            expect(brokerageState.growthLifetime).toBe(1100);
            expect(brokerageState.balanceStartOfYear).toBe(10_000);
            expect(brokerageState.balanceEndOfYear).toBe(12_100);
            expect(brokerageState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxableEndOfYear).toBe(12_100);
            expect(planState.savingsTaxExemptEndOfYear).toBe(0);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should throw error if processing already processed state", () => {
            const brokerageManager = new BrokerageManager(planManager, brokerage)
            brokerageManager.process();
            expect(()=> brokerageManager.process()).toThrow(
                "Failed to process state, it is already processed."
            )
        });

    })


    describe('createNextState', () => {

        it("should process brokerage create the next state", () => {
            const brokerageConfig = {
                ...brokerage,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.Start, brokerage: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const brokerageState = brokerageManager.getCurrentState();
            const newState = brokerageManager.createNextState(brokerageState);

            expect(newState.contribution).toBe(0);
            expect(newState.contributionLifetime).toBe(1_000);
            expect(newState.growthAmount).toBe(0);
            expect(newState.growthLifetime).toBe(1_000);
            expect(newState.balanceStartOfYear).toBe(12_000);
            expect(newState.balanceEndOfYear).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
