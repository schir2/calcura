import {beforeEach, describe, expect, it} from "vitest";
import TaxDeferredInvestmentManager from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {
    EmployerContributionStrategy,
    TaxDeferredContributionStrategy
} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import PlanManager from "~/models/plan/PlanManager";
import {InsufficientFundsStrategy, type Plan} from "~/models/plan/Plan";
import {ProcessTaxDeferredInvestmentCommand} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentCommand";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflationRate: 3,
    insufficientFundsStrategy: InsufficientFundsStrategy.None,
    growthApplicationStrategy: "start",
    taxStrategy: "simple",
    taxRate: 30,
    lifeExpectancy: 85,
    retirementStrategy: "age",
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
            frequency: 'annual'
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: 'annual'
        }
    ],
    expenses: [],
    debts: [],
    brokerageInvestments: [],
    taxDeferredInvestments: [],
    iraInvestments: [],
}

const taxDeferredInvestment: TaxDeferredInvestment = {
    id: 1,
    name: 'Test TaxDeferred Investment',
    growthRate: 6,
    initialBalance: 10_000,
    electiveContributionStrategy: TaxDeferredContributionStrategy.Fixed,
    electiveContributionPercentage: 0,
    electiveContributionFixedAmount: 0,
    employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
    employerCompensationMatchPercentage: 100,
    employerContributionFixedAmount: 0,
    employerMatchPercentageLimit: 0,
    employerMatchPercentage: 0

};

let planManager: PlanManager;

describe("TaxDeferredInvestmentManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestment);
            const state = taxDeferredInvestmentManager.getCurrentState();
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
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, {
                ...taxDeferredInvestment,
                contributionStrategy: TaxDeferredContributionStrategy.Fixed,
                contributionFixedAmount: 100,
            })
            const contribution = taxDeferredInvestmentManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("should calculate percentage income correctly", () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, {
                ...taxDeferredInvestment,
                contributionStrategy: TaxDeferredContributionStrategy.PercentageOfIncome,
                contributionPercentage: 10,
            })
            const contribution = taxDeferredInvestmentManager.calculateContribution();
            expect(contribution).toBe(15_000);
        });

        it("should calculate max contribution correctly", () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, {
                ...taxDeferredInvestment,
                contributionStrategy: TaxDeferredContributionStrategy.Max,
            })
            const contribution = taxDeferredInvestmentManager.calculateContribution();
            expect(contribution).toBe(105_000);
        });
    })

    describe('process', () => {

        it("should process taxDeferredInvestment and update state correctly for start of year application strategy", () => {
            const taxDeferredInvestmentConfig = {
                ...taxDeferredInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: 'start',
                taxDeferredInvestments: [taxDeferredInvestmentConfig]
            })
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestmentConfig)
            taxDeferredInvestmentManager.process();
            const planState = taxDeferredInvestmentManager.orchestrator.getCurrentState();
            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();

            expect(taxDeferredInvestmentState.contribution).toBe(1_000);
            expect(taxDeferredInvestmentState.contributionLifetime).toBe(1_000);
            expect(taxDeferredInvestmentState.growthAmount).toBe(1_000);
            expect(taxDeferredInvestmentState.growthLifetime).toBe(1_000);
            expect(taxDeferredInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(taxDeferredInvestmentState.balanceEndOfYear).toBe(12_000);
            expect(taxDeferredInvestmentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.savingsTaxableEndOfYear).toBe(12_000);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should process taxDeferredInvestment and update state correctly for end of of year application strategy", () => {
            const taxDeferredInvestmentConfig = {
                ...taxDeferredInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: 'end',
                taxDeferredInvestments: [taxDeferredInvestmentConfig]
            })
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestmentConfig)
            taxDeferredInvestmentManager.process();
            const planState = taxDeferredInvestmentManager.orchestrator.getCurrentState();

            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();

            expect(taxDeferredInvestmentState.contribution).toBe(1_000);
            expect(taxDeferredInvestmentState.contributionLifetime).toBe(1_000);
            expect(taxDeferredInvestmentState.growthAmount).toBe(1100);
            expect(taxDeferredInvestmentState.growthLifetime).toBe(1100);
            expect(taxDeferredInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(taxDeferredInvestmentState.balanceEndOfYear).toBe(12_100);
            expect(taxDeferredInvestmentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
            expect(planState.savingsTaxableEndOfYear).toBe(12_100);
            expect(planState.taxedWithdrawals).toBe(1_000);
        });

        it("should throw error if processing already processed state", () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestment)
            taxDeferredInvestmentManager.process();
        });

    })


    describe('getCommands', () => {
        it('should return an array with ProcessTaxDeferredInvestmentCommand', () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestment);
            const commands = taxDeferredInvestmentManager.getCommands();
            expect(commands).toHaveLength(1);
            expect(commands[0]).toBeInstanceOf(ProcessTaxDeferredInvestmentCommand);
        });

        it('should execute ProcessTaxDeferredInvestmentCommand correctly', () => {
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestment);
            const command = new ProcessTaxDeferredInvestmentCommand(taxDeferredInvestmentManager);
            command.execute();
            expect(taxDeferredInvestmentManager.getCurrentState().processed).toBe(true);
        });
    });


    describe('createNextState', () => {

        it("should process taxDeferredInvestment create the next state", () => {
            const taxDeferredInvestmentConfig = {
                ...taxDeferredInvestment,
                initialBalance: 10_000,
                contributionFixedAmount: 1_000,
                growthRate: 10
            }
            planManager = new PlanManager({
                ...planConfig,
                growthApplicationStrategy: 'start',
                taxDeferredInvestments: [taxDeferredInvestmentConfig]
            })
            const taxDeferredInvestmentManager = new TaxDeferredInvestmentManager(planManager, taxDeferredInvestmentConfig)
            taxDeferredInvestmentManager.process();
            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();
            const newState = taxDeferredInvestmentManager.createNextState(taxDeferredInvestmentState);

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
