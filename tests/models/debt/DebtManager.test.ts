import {beforeEach, describe, expect, it} from "vitest";
import DebtManager from "~/models/debt/DebtManager";
import type {Debt} from "~/models/debt/Debt";
import {DebtPaymentStrategy} from "~/models/debt/Debt";
import PlanManager from "~/models/plan/PlanManager";
import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/models/plan/Plan";
import {ProcessDebtCommand} from "~/models/debt/DebtCommands";
import {IncomeFrequency} from "~/models/income/Income";

const planConfig: Plan = {
    id: 1,
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflationRate: 3,
    insufficientFundsStrategy: InsufficientFundsStrategy.None,
    growthRate: 6,
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
            frequency: IncomeFrequency.Annual
        },
        {
            id: 1,
            name: 'Ordinary Income',
            grossIncome: 50_000,
            growthRate: 0,
            incomeType: "ordinary",
            frequency: IncomeFrequency.Annual
        }
    ],
    expenses: [],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
}

const debt: Debt = {
    id: 1,
    name: "Test Debt",
    principal: 1000,
    interestRate: 5,
    paymentMinimum: 50,
    paymentStrategy: DebtPaymentStrategy.Fixed,
    paymentFixedAmount: 100,
    paymentPercentage: 20,

};

let planManager: PlanManager;

describe("DebtManager", () => {
    beforeEach(() => {
        planManager = new PlanManager(planConfig)
    });

    describe('constructor', () => {

        it("should initialize with correct state", () => {
            const debtManager = new DebtManager(planManager, debt);
            const state = debtManager.getCurrentState();
            expect(state.payment).toBe(0);
            expect(state.paymentLifetime).toBe(0);
            expect(state.interestLifetime).toBe(0);
            expect(state.principalStartOfYear).toBe(1_000);
            expect(state.interestAmount).toBe(undefined);
            expect(state.principalEndOfYear).toBe(undefined);
            expect(state.processed).toBe(false);
        });
    })

    describe('calculatePayment', () => {
        it("should calculate fixed payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                paymentStrategy: DebtPaymentStrategy.Fixed,
                principal: 1000,
                paymentPercentage: 10,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(100);
        });

        it("should calculate percentage payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                paymentStrategy: DebtPaymentStrategy.PercentageOfDebt,
                principal: 1000,
                paymentPercentage: 10,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(100);
        });

        it("should calculate max payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                paymentStrategy: DebtPaymentStrategy.MaximumPayment,
                principal: 1000,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(1000);
        });

        it("should calculate minimum payment correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                paymentStrategy: DebtPaymentStrategy.MinimumPayment,
                principal: 2000,
                paymentMinimum: 100,
            })
            const debtState = debtManager.getCurrentState();
            const payment = debtManager.calculatePayment(debtState);
            expect(payment).toBe(1_200);
        })
    })

    describe('process', () => {

        it("should process debt and update state correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                paymentFixedAmount: 1_000,
                interestRate: 10,
            })
            debtManager.process();
            const planState = debtManager.orchestrator.getCurrentState();
            const currentState = debtManager.getCurrentState();

            expect(currentState.payment).toBe(1_000);
            expect(currentState.paymentLifetime).toBe(1_000);
            expect(currentState.interestAmount).toBeCloseTo(900);
            expect(currentState.interestLifetime).toBe(900);
            expect(currentState.principalEndOfYear).toBeCloseTo(9900);
            expect(currentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(104_000);
        });

        it("should process debt and update state correctly", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                paymentFixedAmount: 1_000,
                interestRate: 10,
            })
            debtManager.process();
            debtManager.advanceTimePeriod()
            debtManager.process();
            const planState = debtManager.orchestrator.getCurrentState();
            const currentState = debtManager.getCurrentState();

            expect(currentState.payment).toBe(1_000);
            expect(currentState.paymentLifetime).toBe(2_000);
            expect(currentState.interestAmount).toBe(890);
            expect(currentState.interestLifetime).toBe(900+890);
            expect(currentState.principalEndOfYear).toBeCloseTo(9790);
            expect(currentState.processed).toBe(true);
            expect(planState.taxedIncome).toBe(105_000);
            expect(planState.taxedCapital).toBe(103_000);
        });

        it("should throw error if processing already processed state", () => {
            const debtManager = new DebtManager(planManager, debt)
            debtManager.process();
        });

    })

    describe('calculateInterest', () => {
        it('should return 0 interest for a 0 principal', () => {
            const debtManager = new DebtManager(planManager, debt);
            expect(debtManager.calculateInterest(0)).toBe(0);
        });

        it('should calculate interest correctly for non-zero principal', () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                interestRate: 5,
            });
            expect(debtManager.calculateInterest(1000)).toBeCloseTo(50); // 5% of 1000
        });

        it('should return 0 interest for a 0 interest rate', () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                interestRate: 0,
            });
            expect(debtManager.calculateInterest(1000)).toBe(0);
        });
    });

    describe('getCommands', () => {
        it('should return an array with ProcessDebtCommand', () => {
            const debtManager = new DebtManager(planManager, debt);
            const commands = debtManager.getCommands();
            expect(commands).toHaveLength(1);
            expect(commands[0]).toBeInstanceOf(ProcessDebtCommand);
        });

        it('should execute ProcessDebtCommand correctly', () => {
            const debtManager = new DebtManager(planManager, debt);
            const command = new ProcessDebtCommand(debtManager);
            command.execute();
            expect(debtManager.getCurrentState().processed).toBe(true);
        });
    });


    describe('createNextState', () => {

        it("should process debt create the next state", () => {
            const debtManager = new DebtManager(planManager, {
                ...debt,
                principal: 10_000,
                paymentFixedAmount: 1_000,
                interestRate: 10,
            })
            debtManager.process();
            const debtState = debtManager.getCurrentState();
            const newState = debtManager.createNextState(debtState);

            expect(newState.payment).toBe(0);
            expect(newState.paymentLifetime).toBe(1_000);
            expect(newState.interestAmount).toBe(undefined);
            expect(newState.interestLifetime).toBe(900);
            expect(newState.principalStartOfYear).toBe(debtState.principalEndOfYear);
            expect(newState.principalEndOfYear).toBe(undefined);
            expect(newState.processed).toBe(false);
        });

    })
});
