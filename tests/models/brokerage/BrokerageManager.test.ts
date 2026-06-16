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
    inflation_rate: 3,
    insufficient_funds_strategy: InsufficientFundsStrategy.None,
    growth_application_strategy: GrowthApplicationStrategy.Start,
    tax_strategy: IncomeTaxStrategy.Simple,
    tax_rate: 30,
    life_expectancy: 85,
    retirement_strategy: RetirementStrategy.Age,
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50000,
    retirement_age: 65,
    retirement_savings_amount: 200000,
    retirement_income_adjusted_for_inflation: true,
    cash_reserves: [],
    incomes: [
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 100_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: Frequency.Annually
        },
        {
            id: 1,
            name: 'Ordinary Income',
            gross_income: 50_000,
            growth_rate: 0,
            income_type: "ordinary",
            frequency: Frequency.Annually
        }
    ],
    expenses: [],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    command_sequences: [],
}

const brokerage: Brokerage = {
    id: 1,
    name: 'Test Brokerage ',
    growth_rate: 6,
    initial_balance: 10_000,
    contribution_strategy: BrokerageContributionStrategy.Fixed,
    contribution_percentage: 0,
    contribution_fixed_amount: 0,

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
            expect(state.contribution_lifetime).toBe(0);
            expect(state.growth_amount).toBe(0);
            expect(state.growth_lifetime).toBe(0);
            expect(state.balance_start_of_year).toBe(10_000);
            expect(state.balance_end_of_year).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculateContribution', () => {
        it("should calculate fixed contribution correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contribution_strategy: BrokerageContributionStrategy.Fixed,
                contribution_fixed_amount: 100,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(100);
        });

        it("should calculate percentage income correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contribution_strategy: BrokerageContributionStrategy.PercentageOfIncome,
                contribution_percentage: 10,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(15_000);
        });

        it("should calculate max contribution correctly", () => {
            const brokerageManager = new BrokerageManager(planManager, {
                ...brokerage,
                contribution_strategy: BrokerageContributionStrategy.Max,
            })
            const contribution = brokerageManager.calculateContribution();
            expect(contribution).toBe(105_000);
        });
    })

    describe('process', () => {

        it("should process brokerage and update state correctly for start of year application strategy", () => {
            const brokerageConfig = {
                ...brokerage,
                initial_balance: 10_000,
                contribution_fixed_amount: 1_000,
                growth_rate: 10
            }
            planManager = new PlanManager({...planConfig, growth_application_strategy: GrowthApplicationStrategy.Start, brokerages: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const planState = brokerageManager.orchestrator.getCurrentState();
            const brokerageState = brokerageManager.getCurrentState();

            expect(brokerageState.contribution).toBe(1_000);
            expect(brokerageState.contribution_lifetime).toBe(1_000);
            expect(brokerageState.growth_amount).toBe(1_000);
            expect(brokerageState.growth_lifetime).toBe(1_000);
            expect(brokerageState.balance_start_of_year).toBe(10_000);
            expect(brokerageState.balance_end_of_year).toBe(12_000);
            expect(brokerageState.processed).toBe(true);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(104_000);
            expect(planState.taxable_contributions).toBe(1_000);
            expect(planState.taxable_contributions_lifetime).toBe(1_000);
            expect(planState.savings_taxable_end_of_year).toBe(12_000);
            expect(planState.taxed_withdrawals).toBe(1_000);
        });

        it("should process brokerage and update state correctly for end of of year application strategy", () => {
            const brokerageConfig = {
                ...brokerage,
                initial_balance: 10_000,
                contribution_fixed_amount: 1_000,
                growth_rate: 10
            }
            planManager = new PlanManager({...planConfig, growth_application_strategy: GrowthApplicationStrategy.End, brokerages: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const planState = brokerageManager.orchestrator.getCurrentState();

            const brokerageState = brokerageManager.getCurrentState();

            expect(brokerageState.contribution).toBe(1_000);
            expect(brokerageState.contribution_lifetime).toBe(1_000);
            expect(brokerageState.growth_amount).toBe(1100);
            expect(brokerageState.growth_lifetime).toBe(1100);
            expect(brokerageState.balance_start_of_year).toBe(10_000);
            expect(brokerageState.balance_end_of_year).toBe(12_100);
            expect(brokerageState.processed).toBe(true);
            expect(planState.taxed_income).toBe(105_000);
            expect(planState.taxed_capital).toBe(104_000);
            expect(planState.savings_tax_deferred_end_of_year).toBe(0);
            expect(planState.savings_taxable_end_of_year).toBe(12_100);
            expect(planState.savings_tax_exempt_end_of_year).toBe(0);
            expect(planState.taxed_withdrawals).toBe(1_000);
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
                initial_balance: 10_000,
                contribution_fixed_amount: 1_000,
                growth_rate: 10
            }
            planManager = new PlanManager({...planConfig, growth_application_strategy: GrowthApplicationStrategy.Start, brokerages: [brokerageConfig]})
            const brokerageManager = new BrokerageManager(planManager, brokerageConfig)
            brokerageManager.process();
            const brokerageState = brokerageManager.getCurrentState();
            const newState = brokerageManager.createNextState(brokerageState);

            expect(newState.contribution).toBe(0);
            expect(newState.contribution_lifetime).toBe(1_000);
            expect(newState.growth_amount).toBe(0);
            expect(newState.growth_lifetime).toBe(1_000);
            expect(newState.balance_start_of_year).toBe(12_000);
            expect(newState.balance_end_of_year).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
