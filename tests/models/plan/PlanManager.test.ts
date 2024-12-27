import {beforeEach, describe, expect, it} from "vitest";
import PlanManager, {FundType} from "~/models/plan/PlanManager";
import {GrowthApplicationStrategy, IncomeTaxStrategy, InsufficientFundsStrategy, type Plan, RetirementStrategy} from "~/models/plan/Plan";
import {ContributionType} from "~/models/common";
import {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {IraContributionStrategy} from "~/models/iraInvestment/IraInvestment";
import {RothIraContributionStrategy} from "~/models/rothIraInvestment/RothIraInvestment";
import {BrokerageContributionStrategy} from "~/models/brokerageInvestment/BrokerageInvestment";
import {ExpenseFrequency, ExpenseType} from "~/models/expense/Expense";
import {DebtPaymentStrategy} from "~/models/debt/Debt";

describe("PlanManager", () => {
    let planConfig: Plan;
    let planManager: PlanManager;

    beforeEach(() => {
        planConfig = {
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
                    grossIncome: 100000,
                    growthRate: 0,
                    incomeType: "ordinary",
                    frequency: 'annual'
                },
                {
                    id: 2,
                    name: 'Ordinary Income',
                    grossIncome: 50000,
                    growthRate: 0,
                    incomeType: "ordinary",
                    frequency: 'annual'
                }
            ],
            expenses: [
                {
                    id: 1,
                    name: 'Rent',
                    frequency: ExpenseFrequency.Monthly,
                    amount: 1_800,
                    expenseType: ExpenseType.fixed,
                    growthRate: 0,
                    isEssential: true,
                    isTaxDeductible: false,
                    growsWithInflation: true,
                }],
            debts: [
                {
                    id: 1,
                    name: 'School Loan',
                    interestRate: 8,
                    principal: 100_000,
                    paymentFixedAmount: 600,
                    paymentMinimum: 600,
                    paymentStrategy: DebtPaymentStrategy.MinimumPayment,
                    paymentPercentage: 0,
                }
            ],
            taxDeferredInvestments: [
                {
                    id: 1,
                    name: 'Test TaxDeferred Investment',
                    growthRate: 6,
                    initialBalance: 10_000,
                    electiveContributionStrategy: TaxDeferredContributionStrategy.PercentageOfIncome,
                    electiveContributionPercentage: 6,
                    electiveContributionFixedAmount: 0,
                    employerContributionStrategy: EmployerContributionStrategy.PercentageOfContribution,
                    employerCompensationMatchPercentage: 100,
                    employerContributionFixedAmount: 0,
                    employerMatchPercentageLimit: 3,
                    employerMatchPercentage: 100,
                    income: {
                        id: 1,
                        name: 'Ordinary Income',
                        grossIncome: 100_000,
                        growthRate: 0,
                        incomeType: "ordinary",
                        frequency: 'annual'
                    }

                }
            ],
            brokerageInvestments: [
                {
                    id: 1,
                    name: 'Test Brokerage Investment',
                    growthRate: 6,
                    initialBalance: 10_000,
                    contributionStrategy: BrokerageContributionStrategy.Fixed,
                    contributionPercentage: 0,
                    contributionFixedAmount: 0,

                }
            ],
            iraInvestments: [
                {
                    id: 1,
                    name: 'Test Brokerage Investment',
                    growthRate: 6,
                    initialBalance: 10_000,
                    contributionStrategy: IraContributionStrategy.Fixed,
                    contributionPercentage: 0,
                    contributionFixedAmount: 3_500,
                    income:
                        {
                            id: 1,
                            name: 'Ordinary Income',
                            grossIncome: 100_000,
                            growthRate: 0,
                            incomeType: "ordinary",
                            frequency: 'annual'
                        },
                }],
            rothIraInvestments: [
                {
                    id: 1,
                    name: 'Test Brokerage Investment',
                    growthRate: 6,
                    initialBalance: 10_000,
                    contributionStrategy: RothIraContributionStrategy.Fixed,
                    contributionPercentage: 0,
                    contributionFixedAmount: 3_500,
                    income:
                        {
                            id: 1,
                            name: 'Ordinary Income',
                            grossIncome: 100_000,
                            growthRate: 0,
                            incomeType: "ordinary",
                            frequency: 'annual'
                        },
                }],
        }
        planManager = new PlanManager(planConfig);
    })
    describe('constructor', () => {
        it("should create an initial state with correct defaults", () => {
            const state = planManager.getCurrentState();
            expect(state.age).toBe(30)
            expect(state.year).toBe(new Date().getFullYear())
            expect(state.grossIncome).toBe(150_000)
            expect(state.taxableIncome).toBe(150_000)
            expect(state.taxedIncome).toBe(105_000)
            expect(state.AGI).toBe(0)
            expect(state.taxableCapital).toBe(150_000)
            expect(state.taxedCapital).toBe(105_000)
            expect(state.taxedWithdrawals).toBe(0)
            expect(state.deductions).toBe(0)
            expect(state.electiveLimit).toBe(23_000)
            expect(state.deferredLimit).toBe(69_000)
            expect(state.iraLimit).toBe(7_000)
            expect(state.inflationRate).toBe(3)
            expect(state.taxDeferredContributions).toBe(0)
            expect(state.taxDeferredContributionsLifetime).toBe(0)
            expect(state.taxExemptContributions).toBe(0)
            expect(state.taxExemptContributionsLifetime).toBe(0)
            expect(state.taxableContributions).toBe(0)
            expect(state.taxableContributionsLifetime).toBe(0)
            expect(state.savingsTaxDeferredStartOfYear).toBe(20_000)
            expect(state.savingsTaxDeferredEndOfYear).toBe(20_000)
            expect(state.savingsTaxExemptStartOfYear).toBe(10_000)
            expect(state.savingsTaxExemptEndOfYear).toBe(10_000)
            expect(state.savingsTaxableStartOfYear).toBe(10_000)
            expect(state.savingsTaxableEndOfYear).toBe(10_000)
            expect(state.savingsStartOfYear).toBe(0)
            expect(state.savingsEndOfYear).toBe(0)
            expect(state.retirementIncomeProjected).toBe(0)
            expect(state.retired).toBe(false)
            expect(state.processed).toBe(false)

        })
    })
    describe('requestFunds', () => {
        it("should correctly request funds from taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 50_000;

            expect(planManager.requestFunds(20000, FundType.Taxable)).toBe(20_000);
            expect(planManager.requestFunds(60000, FundType.Taxable)).toBe(50_000);
        });

        it("should correctly request funds from taxed capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxedCapital = 30_000;

            expect(planManager.requestFunds(10_000, FundType.Taxed)).toBe(10_000);
            expect(planManager.requestFunds(40_000, FundType.Taxed)).toBe(30_000);
        });
        it("should allow minimum negative funds for taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 1_000;
            planManager.getConfig().insufficientFundsStrategy = InsufficientFundsStrategy.MinimumOnly;

            expect(planManager.requestFunds(2_000, FundType.Taxable, 1_000)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable, 2_000)).toBe(2_000);
        });

        it("should allow full negative funds for taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 500;
            planManager.getConfig().insufficientFundsStrategy = InsufficientFundsStrategy.Full;

            expect(planManager.requestFunds(1_000, FundType.Taxable)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable)).toBe(2_000);
        });

        it("should handle minimum parameter correctly with InsufficientFundsStrategy.None", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 1000;
            planManager.getConfig().insufficientFundsStrategy = InsufficientFundsStrategy.None;

            expect(planManager.requestFunds(2000, FundType.Taxable, -500)).toBe(1000); // Minimum ignored
        });

        it("should handle invalid fund type gracefully", () => {
            expect(() => planManager.requestFunds(1000, "unsupported" as FundType)).toThrowError(
                "Unsupported fund type: unsupported"
            );
        });
    })
    describe('contribute', () => {
        it("should correctly contribute to tax-deferred savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.savingsTaxDeferredEndOfYear = 0;

            planManager.contribute(5000, ContributionType.TaxDeferred);

            expect(currentState.taxDeferredContributions).toBe(5000);
            expect(currentState.taxDeferredContributionsLifetime).toBe(5000);
        });

        it("should correctly contribute to tax-exempt savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.savingsTaxExemptEndOfYear = 0;

            planManager.contribute(3000, ContributionType.RothIra);

            expect(currentState.taxExemptContributions).toBe(3000);
            expect(currentState.taxExemptContributionsLifetime).toBe(3000);
        });

        it("should correctly contribute to taxable savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.savingsTaxableEndOfYear = 0;

            planManager.contribute(7000, ContributionType.Taxable);

            expect(currentState.taxableContributions).toBe(7000);
            expect(currentState.taxableContributionsLifetime).toBe(7000);
        });
    })
    describe('calculateTaxes', () => {
        it("should correctly calculate taxes based on AGI and tax rate", () => {
            planConfig.taxRate = 30; // Set tax rate to 30%
            planManager = new PlanManager(planConfig);

            const agi = 100000;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(30000);
        });

        it("should return 0 for a 0% tax rate", () => {
            planConfig.taxRate = 0;
            planManager = new PlanManager(planConfig);

            const agi = 100000;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(0);
        });

        it("should return 0 taxes for an AGI of 0", () => {
            planConfig.taxRate = 30;
            planManager = new PlanManager(planConfig);

            const agi = 0;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(0);
        });
    })

    describe('getAGI', () => {
        it("should correctly calculate AGI based on taxable income and deductions", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableIncome = 100000;
            currentState.deductions = 20000;

            const agi = planManager.getAGI(currentState);

            expect(agi).toBe(80000);
        });

        it("should return taxable income as AGI when deductions are 0", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableIncome = 50000;
            currentState.deductions = 0;

            const agi = planManager.getAGI(currentState);

            expect(agi).toBe(50000);
        });

        it("should handle negative AGI when deductions exceed taxable income", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableIncome = 30000;
            currentState.deductions = 40000;

            const agi = planManager.getAGI(currentState);

            expect(agi).toBe(-10000);
        });
    });

    describe("invest", () => {
        it("taxDeferred", () => {
            planManager.getCurrentState().savingsTaxDeferredEndOfYear = 0
            planManager.invest(5_000, ContributionType.TaxDeferred)
            expect(planManager.getCurrentState().savingsTaxDeferredEndOfYear).toBe(5_000)
        })
        it("ira", () => {
            planManager.getCurrentState().savingsTaxDeferredEndOfYear = 0
            planManager.invest(5_000, ContributionType.Ira)
            expect(planManager.getCurrentState().savingsTaxDeferredEndOfYear).toBe(5_000)
        })
        it("rothIra", () => {
            planManager.getCurrentState().savingsTaxDeferredEndOfYear = 0
            planManager.invest(5_000, ContributionType.RothIra)
            expect(planManager.getCurrentState().savingsTaxExemptEndOfYear).toBe(15_000)
        })
        it("taxable", () => {
            planManager.getCurrentState().savingsTaxDeferredEndOfYear = 0
            planManager.invest(5_000, ContributionType.Taxable)
            expect(planManager.getCurrentState().savingsTaxableEndOfYear).toBe(15_000)
        })
        it("elective", () => {
            planManager.getCurrentState().savingsTaxDeferredEndOfYear = 0
            planManager.invest(5_000, ContributionType.Elective)
            expect(planManager.getCurrentState().savingsTaxDeferredEndOfYear).toBe(5_000)
        })
    })

    describe("withdraw", () => {
        it("should correctly withdraw from taxable capital and update state", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 50000;
            currentState.taxableIncome = 50000;
            currentState.taxedWithdrawals = 10000;

            planManager.withdraw(20000, FundType.Taxable);

            expect(currentState.taxableCapital).toBe(30000); // Deducted
            expect(currentState.taxableIncome).toBe(30000); // Adjusted
            const agi = planManager.getAGI(currentState);
            expect(agi).toBe(30000);
            const calculatedTaxes = planManager.calculateTaxes(agi);
            expect(currentState.taxedIncome).toBe(30000 - calculatedTaxes);
            expect(currentState.taxedCapital).toBe(currentState.taxedIncome - currentState.taxedWithdrawals);
        });

        it("should throw an error if taxable withdrawal exceeds available capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 10000;

            expect(() => planManager.withdraw(20000, FundType.Taxable)).toThrow(
                "Insufficient taxable capital for withdrawal"
            );
        });

        it("should correctly withdraw from taxed capital and update state", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxedCapital = 30000;
            currentState.taxedWithdrawals = 5000;

            planManager.withdraw(10000, FundType.Taxed);

            expect(currentState.taxedCapital).toBe(20000); // Deducted
            expect(currentState.taxedWithdrawals).toBe(15000); // Increased
        });

        it("should throw an error if taxed withdrawal exceeds available capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxedCapital = 5000;

            expect(() => planManager.withdraw(10000, FundType.Taxed)).toThrow(
                "Insufficient taxed capital for tax-exempt contribution"
            );
        });

        it("should throw an error for invalid fund type", () => {
            expect(() => planManager.withdraw(10000, "invalid" as FundType)).toThrow(
                "Invalid contribution type"
            );
        });
    });
    describe("getIncomeManagerById", () => {
        it("should return incomeManager", () => {
            expect(planManager.getIncomeManagerById(1)).toBe(planManager.managers.incomeManagers[0])
        })
    })
    describe("getTaxDeferredInvestmentManagerById", () => {
        it("should return taxDeferredInvestmentManager", () => {
            expect(planManager.getTaxDeferredManagerById(1)).toBe(planManager.managers.taxDeferredInvestmentManagers[0])
        })
    })
    describe("getIraInvestmentManagerById", () => {
        it("should return iraInvestmentManager", () => {
            expect(planManager.getIraManagerById(1)).toBe(planManager.managers.iraInvestmentManagers[0])
        })
    })
    describe("getRothIraInvestmentManagerById", () => {
        it("should return iraInvestmentManager", () => {
            expect(planManager.getRothIraManagerById(1)).toBe(planManager.managers.rothIraInvestmentManagers[0])
        })
    })
    describe("getExpenseManagerById", () => {
        it("should return expenseManager", () => {
            expect(planManager.getExpenseManagerById(1)).toBe(planManager.managers.expenseManagers[0])
        })
    })
    describe("getDebtManagerById", () => {
        it("should return debtManager", () => {
            expect(planManager.getDebtManagerById(1)).toBe(planManager.managers.debtManagers[0])
        })
    })
    describe("canRetire", () => {
        it.todo("should return true if retirement age is met when using 'age' strategy");
        it.todo("should return true if all debts are cleared when using 'debt_free' strategy");
        it.todo("should return true if retirement income goal is met when using 'percent_rule' strategy");
        it.todo("should return true if retirement savings amount is met when using 'target_savings' strategy");
        it.todo("should return false if none of the retirement strategies are met");
    });

    describe("getCurrentDebt", () => {
        it.todo("should calculate the total current debt based on all debt managers");
        it.todo("should return 0 if there are no debts");
    });

    describe("getGrossIncome", () => {
        it.todo("should calculate the total gross income from all income managers");
        it.todo("should return 0 if there are no income managers");
    });

    describe("getInflationRate", () => {
        it.todo("should return the configured inflation rate");
    });

    describe("createNextState", () => {
        it.todo("should correctly increment age and year");
        it.todo("should reset savings start of year based on end of year savings");
        it.todo("should recalculate contribution limits for the new year");
        it.todo("should handle inflation rate correctly");
    });

    describe("getAllManagers", () => {
        it.todo("should return a flat array of all managers");
    });

    describe("getCommands", () => {
        it.todo("should collect and return all commands from managers");
    });

    describe("processImplementation", () => {
        it.todo("should return the plan state unchanged (default implementation)");
    });

    describe("simulate", () => {
        it.todo("should correctly simulate the plan over multiple years");
        it.todo("should execute all commands if provided");
        it.todo("should correctly process unprocessed states for all managers");
    });

    describe("processUnprocessed", () => {
        it.todo("should process and return the updated plan state if the manager state is unprocessed");
        it.todo("should return the unchanged plan state if the manager state is already processed");
    });

    describe("getIncomeSummary", () => {
        it.todo("should calculate the total income for each income type");
        it.todo("should return an empty record if there are no incomes");
    });

    describe("getExpenseSummary", () => {
        it.todo("should calculate the total expenses for each expense type");
        it.todo("should return an empty record if there are no expenses");
    });


})