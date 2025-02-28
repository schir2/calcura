import {beforeEach, describe, expect, it} from "vitest";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
import {
    EmployerContributionStrategy,
    TaxDeferredContributionStrategy
} from "~/types/TaxDeferred";
import PlanManager from "~/models/plan/PlanManager";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/types/Plan";
import {ProcessTaxDeferredCommand} from "~/models/taxDeferred/TaxDeferredCommands";

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
    brokerages: [],
    rothIras: [],
    taxDeferreds: [
        {
            id: 1,
            name: 'Test TaxDeferred ',
            growthRate: 6,
            initialBalance: 10_000,
            electiveContributionStrategy: TaxDeferredContributionStrategy.PercentageOfIncome,
            electiveContributionPercentage: 10,
            electiveContributionFixedAmount: 0,
            employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
            employerCompensationMatchPercentage: 100,
            employerContributionFixedAmount: 0,
            employerMatchPercentageLimit: 5,
            employerMatchPercentage: 50,
            income: {
                id: 1,
                name: 'Ordinary Income',
                grossIncome: 100_000,
                growthRate: 0,
                incomeType: "ordinary",
                frequency: Frequency.Annually
            }

        }
    ],
    iras: [],
}


let planManager: PlanManager;
let taxDeferredManager: TaxDeferredManager | undefined;

describe("TaxDeferredManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
        taxDeferredManager = planManager.getManagerById('taxDeferredManagers', 1)
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
                    taxDeferreds: [{
                        ...planConfig.taxDeferreds[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.Fixed,
                        electiveContributionFixedAmount: 100,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredManagers', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(100);
        });

        it("should calculate percentage of income correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferreds: [{
                        ...planConfig.taxDeferreds[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.PercentageOfIncome,
                        electiveContributionPercentage: 10,

                    }]
                }
            )
            const taxDeferredManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredManagers', 1)
            assertDefined(taxDeferredManager, 'TaxDeferredManager')
            const electiveContribution = taxDeferredManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(10_000);
        });

        it("should calculate max electiveContribution correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.Max,
                        electiveContributionPercentage: 10,

                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(Infinity);
        });

        it("should calculate employer_match electiveContribution correctly", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        electiveContributionPercentage: 100,
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        employerCompensationMatchPercentage: 0,
                        employerMatchPercentage: 100,
                        employerMatchPercentageLimit: 3,

                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateElectiveContribution();
            expect(electiveContribution).toBe(3_000);
        });
    })

    describe('calculateEmployerContribution', () => {
        it("fixed", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        employerContributionStrategy: EmployerContributionStrategy.Fixed,
                        employerContributionFixedAmount: 10_000,
                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(10_000);
        });

        it("percentage of compensation", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfCompensation,
                        employerCompensationMatchPercentage: 5,
                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(5_000);
        });

        it("none", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        employerContributionStrategy: EmployerContributionStrategy.None,
                        employerCompensationMatchPercentage: 100,
                        employerMatchPercentageLimit: 3,
                        employerMatchPercentage: 50,
                        employerContributionFixedAmount: 10_000,
                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(0);
        });

        it("percentage of contribution", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        electiveContributionStrategy: TaxDeferredContributionStrategy.Fixed,
                        electiveContributionFixedAmount: 1_500,
                        employerCompensationMatchPercentage: 100,
                        employerMatchPercentageLimit: 3,
                        employerMatchPercentage: 50,
                        employerContributionFixedAmount: 10_000,
                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(750);
        });

        it("percentage of contribution match percentage is 0", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        electiveContributionPercentage: 100,
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        employerCompensationMatchPercentage: 0,
                        employerMatchPercentage: 0,
                        employerMatchPercentageLimit: 3,

                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)

            expect(() => {
                assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
                taxDeferredInvestmentManager.calculateEmployerContribution();
            }).toThrow('Employer match percentage must be greater than 0');
        });

        it("percentage of contribution match limit is 0", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        electiveContributionStrategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        electiveContributionPercentage: 100,
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        employerCompensationMatchPercentage: 0,
                        employerMatchPercentage: 100,
                        employerMatchPercentageLimit: 0,

                    }]
                }
            )
            const taxDeferredInvestmentManager = planManager.getManagerById<TaxDeferredManager>('taxDeferredInvestmentManagers', 1)
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const electiveContribution = taxDeferredInvestmentManager.calculateEmployerContribution();
            expect(electiveContribution).toBe(0);
        });
    })

    describe('process', () => {

        it("should process taxDeferredInvestment and update state correctly for start of year application strategy", () => {

            planManager = new PlanManager(
                {
                    ...planConfig,
                    growthApplicationStrategy: GrowthApplicationStrategy.Start,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        growthRate: 6,
                        electiveContributionStrategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        electiveContributionPercentage: 100,
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        employerMatchPercentage: 50,
                        employerMatchPercentageLimit: 6,

                    }]
                }
            )
            taxDeferredInvestmentManager = planManager.getManagerById('taxDeferredInvestmentManagers', 1)
assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            taxDeferredInvestmentManager.process();
            const planState = taxDeferredInvestmentManager.orchestrator.getCurrentState();
            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();

            expect(taxDeferredInvestmentState.contribution).toBe(18_000);
            expect(taxDeferredInvestmentState.contributionLifetime).toBe(18_000);
            expect(taxDeferredInvestmentState.electiveContribution).toBe(12_000);
            expect(taxDeferredInvestmentState.electiveContributionLifetime).toBe(12_000);
            expect(taxDeferredInvestmentState.employerContribution).toBe(6_000);
            expect(taxDeferredInvestmentState.employerContributionLifetime).toBe(6_000);
            expect(taxDeferredInvestmentState.growthAmount).toBe(600);
            expect(taxDeferredInvestmentState.growthLifetime).toBe(600);
            expect(taxDeferredInvestmentState.balanceStartOfYear).toBe(10_000);
            expect(taxDeferredInvestmentState.balanceEndOfYear).toBe(28_600);
            expect(taxDeferredInvestmentState.processed).toBe(true);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(28_600);
            expect(planState.taxedIncome).toBe(96_600);
            expect(planState.taxedCapital).toBe(96_600);
            expect(planState.taxedWithdrawals).toBe(0);
        });

        it("should process taxDeferredInvestment and update state correctly for end of of year application strategy", () => {
            planManager = new PlanManager(
                {
                    ...planConfig,
                    growthApplicationStrategy: GrowthApplicationStrategy.End,
                    taxDeferredInvestments: [{
                        ...planConfig.taxDeferredInvestments[0],
                        growthRate: 6,
                        electiveContributionStrategy: TaxDeferredContributionStrategy.UntilCompanyMatch,
                        electiveContributionPercentage: 100,
                        employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                        employerMatchPercentage: 50,
                        employerMatchPercentageLimit: 6,

                    }]
                }
            )
            taxDeferredInvestmentManager = planManager.getManagerById('taxDeferredInvestmentManagers', 1)
assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            taxDeferredInvestmentManager.process();
            const planState = taxDeferredInvestmentManager.orchestrator.getCurrentState();
            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();

            expect(taxDeferredInvestmentState.electiveContribution).toBe(12_000);
            expect(taxDeferredInvestmentState.electiveContributionLifetime).toBe(12_000);
            expect(taxDeferredInvestmentState.employerContribution).toBe(6_000);
            expect(taxDeferredInvestmentState.employerContributionLifetime).toBe(6_000);
            expect(taxDeferredInvestmentState.growthAmount).toBe(1680);
            expect(taxDeferredInvestmentState.growthLifetime).toBe(1680);
            expect(taxDeferredInvestmentState.balanceStartOfYear).toBe(10_000);
            +
                expect(taxDeferredInvestmentState.balanceEndOfYear).toBe(29_680);
            expect(taxDeferredInvestmentState.processed).toBe(true);
            expect(planState.savingsTaxDeferredEndOfYear).toBe(29_680);
            expect(planState.taxedIncome).toBe(96_600);
            expect(planState.taxedCapital).toBe(96_600);
            expect(planState.taxedWithdrawals).toBe(0);
        });

        it("should throw error if processing already processed state", () => {
            const taxDeferredInvestmentManager = planManager.getManagerById('taxDeferredInvestmentManagers', 1)
assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            taxDeferredInvestmentManager.process();
            expect(() => taxDeferredInvestmentManager.process()).toThrow(
                "Failed to process state, it is already processed."
            );
        });

    })


    describe('getCommands', () => {
        it('should return an array with ProcessTaxDeferredInvestmentCommand', () => {
            const taxDeferredInvestmentManager = planManager.getManagerById('taxDeferredInvestmentManagers', 1)
assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const commands = taxDeferredInvestmentManager.getCommands();
            expect(commands).toHaveLength(1);
            expect(commands[0]).toBeInstanceOf(ProcessTaxDeferredInvestmentCommand);
        });

        it('should execute ProcessTaxDeferredInvestmentCommand correctly', () => {
            const taxDeferredInvestmentManager = planManager.getManagerById('taxDeferredInvestmentManagers', 1)
assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            const command = new ProcessTaxDeferredInvestmentCommand(taxDeferredInvestmentManager);
            command.execute();
            expect(taxDeferredInvestmentManager.getCurrentState().processed).toBe(true);
        });
    });


    describe('createNextState', () => {

        it("should process taxDeferredInvestment create the next state", () => {
            assertDefined(taxDeferredInvestmentManager, 'TaxDeferredInvestmentManager')
            taxDeferredInvestmentManager.process();
            const taxDeferredInvestmentState = taxDeferredInvestmentManager.getCurrentState();
            const newState = taxDeferredInvestmentManager.createNextState(taxDeferredInvestmentState);
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
