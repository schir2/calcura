import {beforeEach, describe, expect, it} from "vitest";
import BrokerageInvestmentManager from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import type BrokerageInvestmentState from "~/models/brokerageInvestment/BrokerageInvestmentState";
import type {PlanState} from "~/models/plan/PlanState";

describe("BrokerageInvestmentManager", () => {
    let manager: BrokerageInvestmentManager;
    const config: BrokerageInvestment = {
        id: 1,
        name: "Test Brokerage Investment Config",
        contributionStrategy: 'fixed',
        contributionFixedAmount: 100,
        contributionPercentage: 10,
        initialBalance: 1000,
        growthRate: 5,
    };
    beforeEach(() => {
        manager = new BrokerageInvestmentManager(config);
    });

    describe("constructor", () => {
        it("Should create initial manager with ", () => {
            expect(manager.getConfig() == config)
        })
    })

    describe("getConfig", () => {
        it("Should create initial manager with ", () => {
            expect(manager.getConfig() == config)
        })
    })

    describe("getContribution", () => {
        it("should return the fixed contribution amount when strategy is 'fixed'", () => {
            const disposableIncome = 500;
            const result = manager.getContribution(disposableIncome);
            expect(result).toBe(100); // Replace with the expected result
        });

        it("should calculate percentage of income when strategy is 'percentage_of_income'", () => {
            manager.getConfig().contributionStrategy = 'percentage_of_income';
            const disposableIncome = 500;
            const incomePreTaxed = 1000;
            const result = manager.getContribution(disposableIncome, incomePreTaxed);
            expect(result).toBe(100); // Replace with expected percentage calculation
        });

        it("should return the entire disposable income when strategy is 'max'", () => {
            manager.getConfig().contributionStrategy = 'max';
            const disposableIncome = 500;
            const result = manager.getContribution(disposableIncome);
            expect(result).toBe(500); // Replace with expected result
        });

        it("should adjust contribution based on 'insufficientFundsStrategy'", () => {
            const disposableIncome = 50;
            const contribution = manager.getContribution(disposableIncome, undefined, 'none');
            expect(contribution).toBe(50)
        });
    });

    describe("calculateGrowthAmount", () => {
        it("should calculate growth amount correctly", () => {
            const state: BrokerageInvestmentState = {
                balanceStartOfYear: 1000,
                contribution: 100,
                growthAmount: 0,
                balanceEndOfYear: undefined,
            };
            const result = manager.calculateGrowthAmount(state);
            expect(result).toBeCloseTo(50, 2); // Replace with expected growth calculation
        });
    });

    describe("createInitialState", () => {
        it("should initialize state correctly", () => {
            const state = manager.getInitialState();
            expect(state).toStrictEqual({
                contribution: 0,
                growthAmount: 0,
                balanceStartOfYear: 1000,
                balanceEndOfYear: undefined,
            });
        });
    });

    describe("advanceTimePeriod", () => {
        it("should create the next state based on the previous state", () => {
            const nextState = manager.advanceTimePeriod();
            //TODO Fix this test add error as well as success
        });
    });

    describe("process", () => {
        it("should process and update plan state correctly", () => {
            const planState: Partial<PlanState> = {
                taxedIncome: 1000,
                grossIncome: 2000,
                insufficientFundsStrategy: 'none',
            };

            const updatedPlanState = manager.process(planState as PlanState);
            assertDefined(planState.taxedIncome, 'planState.taxedIncome')
            expect(updatedPlanState.taxedIncome).toBe(planState.taxedIncome - manager.getCurrentState().contribution);
        });
    });
});
