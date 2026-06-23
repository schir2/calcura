import {beforeEach, describe, expect, it} from "vitest";
import PlanManager, {FundType} from "~/models/plan/PlanManager";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";

import {ContributionType} from "#shared/types/ContributionType";

describe("PlanManager", () => {
    let planConfig: Plan;
    let planManager: PlanManager;

    beforeEach(() => {
        planConfig = {
            id: 1,
            name: "Blank Plan",
            age: 30,
            year: 2025,
            inflation_rate: 3,
            insufficient_funds_strategy: 'none',
            growth_application_strategy: 'start',
            tax_strategy: 'simple',
            tax_rate: 30,
            life_expectancy: 85,
            retirement_strategy: 'age',
            retirement_withdrawal_rate: 4,
            retirement_income_goal: 50000,
            retirement_age: 65,
            retirement_savings_amount: 200000,
            retirement_income_adjusted_for_inflation: true,
            cash_reserves: [
                {
                    id: 10,
                    name: 'Cash Reserve',
                    contribution_strategy: 'fixed',
                    reserve_months: 0,
                    reserve_amount: 10_000,
                    initial_amount: 15_000,
                }
            ],
            incomes: [
                {
                    id: 1,
                    name: 'Ordinary Income',
                    gross_income: 100000,
                    growth_rate: 0,
                    income_type: "ordinary",
                    frequency: 'annual'
                },
                {
                    id: 2,
                    name: 'Ordinary Income',
                    gross_income: 50000,
                    growth_rate: 0,
                    income_type: "ordinary",
                    frequency: 'annual'
                }
            ],
            expenses: [
                {
                    id: 1,
                    name: 'Rent',
                    frequency: 'monthly',
                    amount: 1_800,
                    expense_type: 'fixed',
                    growth_rate: 0,
                    is_essential: true,
                    is_tax_deductible: false,
                    grows_with_inflation: true,
                },
                {
                    id: 2,
                    name: 'Gym',
                    frequency: 'monthly',
                    amount: 70,
                    expense_type: 'fixed',
                    growth_rate: 0,
                    is_essential: false,
                    is_tax_deductible: false,
                    grows_with_inflation: true,
                },
                {
                    id: 3,
                    name: 'Climbing',
                    frequency: 'annual',
                    amount: 1450,
                    expense_type: 'fixed',
                    growth_rate: 0,
                    is_essential: false,
                    is_tax_deductible: false,
                    grows_with_inflation: true,
                }],
            debts: [
                {
                    id: 1,
                    name: 'School Loan',
                    interest_rate: 8,
                    principal: 100_000,
                    payment_fixed_amount: 600,
                    payment_minimum: 600,
                    payment_strategy: 'minimum_payment',
                    payment_percentage: 0,
                    frequency: 'annual',
                }
            ],
            tax_deferreds: [
                {
                    id: 1,
                    name: 'Test TaxDeferred ',
                    growth_rate: 6,
                    initial_balance: 10_000,
                    elective_contribution_strategy: 'percentage_of_income',
                    elective_contribution_percentage: 6,
                    elective_contribution_fixed_amount: 0,
                    employer_contribution_strategy: 'percentage_of_contribution',
                    employer_compensation_match_percentage: 100,
                    employer_contribution_fixed_amount: 0,
                    employer_match_percentage_limit: 3,
                    employer_match_percentage: 100,
                    income: {
                        id: 1,
                        name: 'Ordinary Income',
                        gross_income: 100_000,
                        growth_rate: 0,
                        income_type: "ordinary",
                        frequency: 'annual'
                    }

                }
            ],
            brokerages: [
                {
                    id: 1,
                    name: 'Test Brokerage ',
                    growth_rate: 6,
                    initial_balance: 10_000,
                    contribution_strategy: 'fixed',
                    contribution_percentage: 0,
                    contribution_fixed_amount: 0,

                }
            ],
            iras: [
                {
                    id: 1,
                    name: 'Test Brokerage ',
                    growth_rate: 6,
                    initial_balance: 10_000,
                    contribution_strategy: 'fixed',
                    contribution_percentage: 0,
                    contribution_fixed_amount: 3_500,
                    income:
                        {
                            id: 1,
                            name: 'Ordinary Income',
                            gross_income: 100_000,
                            growth_rate: 0,
                            income_type: "ordinary",
                            frequency: 'annual'
                        },
                }],
            roth_iras: [
                {
                    id: 1,
                    name: 'Test Brokerage ',
                    growth_rate: 6,
                    initial_balance: 10_000,
                    contribution_strategy: 'fixed',
                    contribution_percentage: 0,
                    contribution_fixed_amount: 3_500,
                    income:
                        {
                            id: 1,
                            name: 'Ordinary Income',
                            gross_income: 100_000,
                            growth_rate: 0,
                            income_type: "ordinary",
                            frequency: 'annual'
                        },
                }],
            hsas: [],
            command_sequences: []
        }
        planManager = new PlanManager(planConfig);
    })
    describe('constructor', () => {
        it("should create an initial state with correct defaults", () => {
            const state = planManager.getCurrentState();
            expect(state.plan.age).toBe(30)
            expect(state.plan.year).toBe(2025)
            expect(state.income.gross).toBe(150_000)
            expect(state.income.taxable).toBe(150_000)
            expect(state.income.net).toBe(105_000)
            expect(state.income.agi).toBe(0)
            expect(state.cash.taxable).toBe(150_000)
            expect(state.cash.net).toBe(105_000)
            expect(state.cash.spent).toBe(0)
            expect(state.limits.elective).toBe(23_500)
            expect(state.limits.deferred).toBe(70_000)
            expect(state.limits.ira).toBe(7_000)
            expect(state.plan.inflation_rate).toBe(3)
            expect(state.assets.tax_deferred.contribution).toBe(0)
            expect(state.assets.tax_deferred.contribution_lifetime).toBe(0)
            expect(state.assets.tax_exempt.contribution).toBe(0)
            expect(state.assets.tax_exempt.contribution_lifetime).toBe(0)
            expect(state.assets.taxable.contribution).toBe(0)
            expect(state.assets.taxable.contribution_lifetime).toBe(0)
            expect(state.assets.tax_deferred.balance_start).toBe(20_000)
            expect(state.assets.tax_deferred.balance_end).toBe(20_000)
            expect(state.assets.tax_exempt.balance_start).toBe(10_000)
            expect(state.assets.tax_exempt.balance_end).toBe(10_000)
            expect(state.assets.taxable.balance_start).toBe(10_000)
            expect(state.assets.taxable.balance_end).toBe(10_000)
            expect(
                state.assets.tax_deferred.balance_start +
                state.assets.tax_exempt.balance_start +
                state.assets.taxable.balance_start
            ).toBe(40_000)
            expect(state.plan.retirement_income_projected).toBe(0)
            expect(state.retired).toBe(false)
            expect(state.processed).toBe(false)
        })
    })
    describe('requestFunds', () => {
        it("should correctly request funds from taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 50_000;

            expect(planManager.requestFunds(20000, FundType.Taxable)).toBe(20_000);
            expect(planManager.requestFunds(60000, FundType.Taxable)).toBe(50_000);
        });

        it("should correctly request funds from taxed capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.net = 30_000;

            expect(planManager.requestFunds(10_000, FundType.Taxed)).toBe(10_000);
            expect(planManager.requestFunds(40_000, FundType.Taxed)).toBe(30_000);
        });
        it("should allow minimum negative funds for taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 1_000;
            planManager.getConfig().insufficient_funds_strategy = 'minimum_only';

            expect(planManager.requestFunds(2_000, FundType.Taxable, 1_000)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable, 2_000)).toBe(2_000);
        });

        it("should allow full negative funds for taxable capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 500;
            planManager.getConfig().insufficient_funds_strategy = 'full';

            expect(planManager.requestFunds(1_000, FundType.Taxable)).toBe(1_000);
            expect(planManager.requestFunds(2_000, FundType.Taxable)).toBe(2_000);
        });

        it("should handle minimum parameter correctly with InsufficientFundsStrategy.None", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 1000;
            planManager.getConfig().insufficient_funds_strategy = 'none';

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
            currentState.assets.tax_deferred.balance_end = 0;

            planManager.contribute(5000, ContributionType.TaxDeferred);

            expect(currentState.assets.tax_deferred.contribution).toBe(5000);
            expect(currentState.assets.tax_deferred.contribution_lifetime).toBe(5000);
        });

        it("should correctly contribute to tax-exempt savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.assets.tax_exempt.balance_end = 0;

            planManager.contribute(3000, ContributionType.RothIra);

            expect(currentState.assets.tax_exempt.contribution).toBe(3000);
            expect(currentState.assets.tax_exempt.contribution_lifetime).toBe(3000);
        });

        it("should correctly contribute to taxable savings", () => {
            const currentState = planManager.getCurrentState();
            currentState.assets.taxable.balance_end = 0;

            planManager.contribute(7000, ContributionType.Taxable);

            expect(currentState.assets.taxable.contribution).toBe(7000);
            expect(currentState.assets.taxable.contribution_lifetime).toBe(7000);
        });
    })
    describe('calculateTaxes', () => {
        it("should correctly calculate taxes based on AGI and tax rate", () => {
            planConfig.tax_rate = 30;
            planManager = new PlanManager(planConfig);

            const agi = 100000;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(30000);
        });

        it("should return 0 for a 0% tax rate", () => {
            planConfig.tax_rate = 0;
            planManager = new PlanManager(planConfig);

            const agi = 100000;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(0);
        });

        it("should return 0 taxes for an AGI of 0", () => {
            planConfig.tax_rate = 30;
            planManager = new PlanManager(planConfig);

            const agi = 0;
            const calculatedTaxes = planManager.calculateTaxes(agi);

            expect(calculatedTaxes).toBe(0);
        });
    })

    describe('getAGI', () => {
        it("should return the current taxable income as AGI", () => {
            const currentState = planManager.getCurrentState();
            currentState.income.taxable = 100000;

            const agi = planManager.getAGI(currentState);

            expect(agi).toBe(100000);
        });
    });

    describe("invest", () => {
        it("taxDeferred", () => {
            planManager.getCurrentState().assets.tax_deferred.balance_end = 0
            planManager.invest(5_000, ContributionType.TaxDeferred)
            expect(planManager.getCurrentState().assets.tax_deferred.balance_end).toBe(5_000)
        })
        it("ira", () => {
            planManager.getCurrentState().assets.tax_deferred.balance_end = 0
            planManager.invest(5_000, ContributionType.Ira)
            expect(planManager.getCurrentState().assets.tax_deferred.balance_end).toBe(5_000)
        })
        it("rothIra", () => {
            planManager.getCurrentState().assets.tax_deferred.balance_end = 0
            planManager.invest(5_000, ContributionType.RothIra)
            expect(planManager.getCurrentState().assets.tax_exempt.balance_end).toBe(15_000)
        })
        it("taxable", () => {
            planManager.getCurrentState().assets.tax_deferred.balance_end = 0
            planManager.invest(5_000, ContributionType.Taxable)
            expect(planManager.getCurrentState().assets.taxable.balance_end).toBe(15_000)
        })
        it("elective", () => {
            planManager.getCurrentState().assets.tax_deferred.balance_end = 0
            planManager.invest(5_000, ContributionType.Elective)
            expect(planManager.getCurrentState().assets.tax_deferred.balance_end).toBe(5_000)
        })
    })

    describe("withdraw", () => {
        it("should correctly withdraw from taxable capital and update state", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 50000;
            currentState.income.taxable = 50000;
            currentState.cash.spent = 10000;

            planManager.withdraw(20000, FundType.Taxable);

            expect(currentState.cash.taxable).toBe(30000);
            expect(currentState.income.taxable).toBe(30000);
            const agi = planManager.getAGI(currentState);
            expect(agi).toBe(30000);
            const calculatedTaxes = planManager.calculateTaxes(agi);
            expect(currentState.income.net).toBe(30000 - calculatedTaxes);
            expect(currentState.cash.net).toBe(currentState.income.net - currentState.cash.spent);
        });

        it("should throw an error if taxable withdrawal exceeds available capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.taxable = 10000;

            expect(() => planManager.withdraw(20000, FundType.Taxable)).toThrow(
                "Insufficient taxable capital for withdrawal"
            );
        });

        it("should correctly withdraw from taxed capital and update state", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.net = 30000;
            currentState.cash.spent = 5000;

            planManager.withdraw(10000, FundType.Taxed);

            expect(currentState.cash.net).toBe(20000);
            expect(currentState.cash.spent).toBe(15000);
        });

        it("should throw an error if taxed withdrawal exceeds available capital", () => {
            const currentState = planManager.getCurrentState();
            currentState.cash.net = 5000;

            expect(() => planManager.withdraw(10000, FundType.Taxed)).toThrow(
                "Insufficient taxed capital for tax-exempt contribution"
            );
        });

        it("should throw an error for invalid fund type", () => {
            expect(() => planManager.withdraw(10000, "invalid" as FundType)).toThrow(
                "Invalid fund type"
            );
        });
    });

    describe("getAnnualExpenseTotal", () => {
        it("should calculate expenses correctly", () => {
            expect(planManager.getAnnualExpenseTotal()).toBe(1_800*12 + 70 * 12 + 1450)
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