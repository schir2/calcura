import {beforeEach, describe, expect, it} from "vitest";
import PlanManager, {FundType} from "~/models/plan/PlanManager";
import {InsufficientFundsStrategy, type Plan} from "~/models/plan/Plan";
import {ContributionType} from "~/models/common";

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
                    grossIncome: 100000,
                    growthRate: 0,
                    incomeType: "ordinary",
                    frequency: 'annual'
                },
                {
                    id: 1,
                    name: 'Ordinary Income',
                    grossIncome: 50000,
                    growthRate: 0,
                    incomeType: "ordinary",
                    frequency: 'annual'
                }
            ],
            expenses: [],
            debts: [],
            taxDeferredInvestments: [],
            brokerageInvestments: [],
            iraInvestments: [],
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
            expect(state.savingsTaxDeferredStartOfYear).toBe(0)
            expect(state.savingsTaxDeferredEndOfYear).toBe(0)
            expect(state.savingsTaxExemptStartOfYear).toBe(0)
            expect(state.savingsTaxExemptEndOfYear).toBe(0)
            expect(state.savingsTaxableStartOfYear).toBe(0)
            expect(state.savingsTaxableEndOfYear).toBe(0)
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
            planManager.config.insufficientFundsStrategy = InsufficientFundsStrategy.MinimumOnly;

            expect(planManager.requestFunds(2_000, FundType.Taxable, 1_000)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable, 2_000)).toBe(2_000);
        });

        it("should allow full negative funds for taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 500;
            planManager.config.insufficientFundsStrategy = InsufficientFundsStrategy.Full;

            expect(planManager.requestFunds(1_000, FundType.Taxable)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable)).toBe(2_000);
        });

        it("should handle minimum parameter correctly with InsufficientFundsStrategy.None", () => {
            const currentState = planManager.getCurrentState();
            currentState.taxableCapital = 1000;
            planManager.config.insufficientFundsStrategy = InsufficientFundsStrategy.None;

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

            expect(currentState.savingsTaxDeferredEndOfYear).toBe(5000);
        });

        it("should correctly contribute to tax-exempt savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.savingsTaxExemptEndOfYear = 0;

            planManager.contribute(3000, ContributionType.TaxExempt);

            expect(currentState.savingsTaxExemptEndOfYear).toBe(3000);
        });

        it("should correctly contribute to taxable savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.savingsTaxableEndOfYear = 0;

            planManager.contribute(7000, ContributionType.Taxable);

            expect(currentState.savingsTaxableEndOfYear).toBe(7000);
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