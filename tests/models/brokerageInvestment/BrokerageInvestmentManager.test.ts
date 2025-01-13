import {beforeEach, describe, expect, it} from "vitest";
import {BrokerageInvestmentManager} from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import {BrokerageContributionStrategy} from "~/models/brokerageInvestment/BrokerageInvestment";
import PlanManager from "~/models/plan/PlanManager";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/models/plan/Plan";
import {ProcessBrokerageInvestmentCommand} from "~/models/brokerageInvestment/BrokerageInvestmentCommands";
import {IncomeFrequency} from "~/models/income/Income";

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
    cashReserves: [],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 100_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: IncomeFrequency.annual
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: IncomeFrequency.annual
        }
    ],
    expenses: [],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
}

const brokerageInvestment: BrokerageInvestment = {
    id: 1,
    name: 'Test Brokerage Investment',
    growthRate: 6,
    initialBalance: 10_000,
    contributionStrategy: BrokerageContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,

};

let planManager: PlanManager;

describe("BrokerageInvestmentManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestment);
            const state = brokerageInvestmentManager.getCurrentState();
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
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, {
                ...brokerageInvestment,
                contributionStrategy: BrokerageContributionStrategy.Fixed,
                contributionFixedAmount: 100,
            })
            const contribution = brokerageInvestmentManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("should calculate percentage income correctly", () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, {
                ...brokerageInvestment,
                contributionStrategy: BrokerageContributionStrategy.PercentageOfIncome,
                contributionPercentage: 10,
            })
            const contribution = brokerageInvestmentManager.calculateContribution();
            expect(contribution).toBe(15_000);
        });

        it("should calculate max contribution correctly", () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, {
                ...brokerageInvestment,
                contributionStrategy: BrokerageContributionStrategy.Max,
            })
            const contribution = brokerageInvestmentManager.calculateContribution();
            expect(contribution).toBe(105_000);
        });
    })

    describe('process', () => {

        it("should process brokerageInvestment and update state correctly for start of year application strategy", () => {
            const brokerageInvestmentConfig = {
                ...brokerageInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.Start, brokerageInvestments: [brokerageInvestmentConfig]})
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestmentConfig)
            brokerageInvestmentManager.process();
            const planState = brokerageInvestmentManager.orchestrator.getCurrentState();
            const brokerageInvestmentState = brokerageInvestmentManager.getCurrentState();

            expect(brokerageInvestmentState.contribution).toBe(1_000);
            expect(brokerageInvestmentState.contributionLifetime).toBe(1_000);
            expect(brokerageInvestmentState.growthAmount).toBe(1_000);
            expect(brokerageInvestmentState.growthLifetime).toBe(1_000);
            expect(brokerageInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(brokerageInvestmentState.balanceEndOfYear).toBe(12_000);
            expect(brokerageInvestmentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.taxableContributions).toBe(1_000);
            expect(planState.taxableContributionsLifetime).toBe(1_000);
            expect(planState.savingsTaxableEndOfYear).toBe(12_000);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should process brokerageInvestment and update state correctly for end of of year application strategy", () => {
            const brokerageInvestmentConfig = {
                ...brokerageInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.End, brokerageInvestments: [brokerageInvestmentConfig]})
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestmentConfig)
            brokerageInvestmentManager.process();
            const planState = brokerageInvestmentManager.orchestrator.getCurrentState();

            const brokerageInvestmentState = brokerageInvestmentManager.getCurrentState();

            expect(brokerageInvestmentState.contribution).toBe(1_000);
            expect(brokerageInvestmentState.contributionLifetime).toBe(1_000);
            expect(brokerageInvestmentState.growthAmount).toBe(1100);
            expect(brokerageInvestmentState.growthLifetime).toBe(1100);
            expect(brokerageInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(brokerageInvestmentState.balanceEndOfYear).toBe(12_100);
            expect(brokerageInvestmentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(0);
            expect(planState.savingsTaxableEndOfYear).toBe(12_100);
            expect(planState.savingsTaxExemptEndOfYear).toBe(0);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should throw error if processing already processed state", () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestment)
            brokerageInvestmentManager.process();
            expect(()=> brokerageInvestmentManager.process()).toThrow(
                "Failed to process state, it is already processed."
            )
        });

    })


    describe('getCommands', () => {
        it('should return an array with ProcessBrokerageInvestmentCommand', () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestment);
            const commands = brokerageInvestmentManager.getCommands();
            expect(commands).toHaveLength(1);
            expect(commands[0]).toBeInstanceOf(ProcessBrokerageInvestmentCommand);
        });

        it('should execute ProcessBrokerageInvestmentCommand correctly', () => {
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestment);
            const command = new ProcessBrokerageInvestmentCommand(brokerageInvestmentManager);
            command.execute();
            expect(brokerageInvestmentManager.getCurrentState().processed).toBe(true);
        });
    });


    describe('createNextState', () => {

        it("should process brokerageInvestment create the next state", () => {
            const brokerageInvestmentConfig = {
                ...brokerageInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({...planConfig, growthApplicationStrategy: GrowthApplicationStrategy.Start, brokerageInvestments: [brokerageInvestmentConfig]})
            const brokerageInvestmentManager = new BrokerageInvestmentManager(planManager, brokerageInvestmentConfig)
            brokerageInvestmentManager.process();
            const brokerageInvestmentState = brokerageInvestmentManager.getCurrentState();
            const newState = brokerageInvestmentManager.createNextState(brokerageInvestmentState);

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
