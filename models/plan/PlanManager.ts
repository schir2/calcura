import type {Plan} from "~/models/plan/Plan";
import type {PlanState} from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
import type Command from "~/models/common/Command";
import IncomeManager from "~/models/income/IncomeManager";
import type {IncomeType} from "~/models/income/Income";
import BrokerageInvestmentManager from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import ExpenseManager from "~/models/expense/ExpenseManager";
import IraInvestmentManager from "~/models/iraInvestment/IraInvestmentManager";
import CashReserveManager from "~/models/cashReserve/CashReserveManager";
import TaxDeferredInvestmentManager from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";
import type {ExpenseType} from "~/models/expense/Expense";
import {ContributionType} from "~/models/common";
import BaseOrchestrator from "~/models/common/BaseOrchestrator";

export enum FundType {
    Taxable = "taxable",
    Taxed = "taxed",

}


export default class PlanManager extends BaseOrchestrator<Plan, PlanState> {

    createManagers(): Record<string, BaseManager<any, any>[]> {
        return {
            incomeManagers: this.config.incomes.map((income) => new IncomeManager(income)),
            cashReserveManagers: this.config.cashReserves.map((cashReserve) => new CashReserveManager(cashReserve)),
            expenseManagers: this.config.expenses.map((expense) => new ExpenseManager(expense)),
            debtManagers: this.config.debts.map((debt) => new DebtManager(debt)),
            brokerageInvestmentManagers: this.config.brokerageInvestments.map((brokerageInvestment) => new BrokerageInvestmentManager(brokerageInvestment)),
            iraInvestmentManagers: this.config.iraInvestments.map((iraInvestment) => new IraInvestmentManager(iraInvestment)),
            taxDeferredManagers: this.config.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestmentManager(taxDeferredInvestment))
        }
    }

    protected createInitialState(): PlanState {
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        return {
            age: this.config.age,
            year: this.config.year,

            grossIncome: grossIncome,
            taxableIncome: grossIncome,
            taxedIncome: taxedIncome,
            AGI: 0,

            taxableCapital: grossIncome,
            taxedCapital: taxedIncome,
            taxedWithdrawals: 0,

            deductions: 0,

            inflationRate: this.config.inflationRate,

            electiveLimit: getTaxDeferredElectiveContributionLimit(this.config.year, this.config.age),
            deferredLimit: getTaxDeferredContributionLimit(this.config.year, this.config.age),
            iraLimit: getIraLimit(this.config.year, this.config.age),

            savingsTaxDeferredStartOfYear: 0,
            savingsTaxDeferredEndOfYear: 0,

            savingsTaxExemptStartOfYear: 0,
            savingsTaxExemptEndOfYear: 0,

            savingsTaxableStartOfYear: 0,
            savingsTaxableEndOfYear: 0,

            savingsStartOfYear: 0,
            savingsEndOfYear: 0,

            retirementIncomeProjected: 0,
            retired: false,

            processed: false,
        }
    }

    requestFunds(amount: number, fundType: FundType): number {
        const currentState = this.getCurrentState()
        switch (fundType) {
            case FundType.Taxable:
                return Math.min(currentState.taxableCapital, amount)
            case FundType.Taxed:
                return Math.min(currentState.taxedCapital, amount)
        }
    }


    contribute(amount: number, contributionType: ContributionType): void {
        const currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                currentState.savingsTaxDeferredEndOfYear += amount;
                break;
            case ContributionType.TaxExempt:
                currentState.savingsTaxExemptEndOfYear += amount;
                break;
            case ContributionType.Taxable:
                currentState.savingsTaxableEndOfYear += amount;
                break;
        }
        this.updateCurrentState(currentState);
    }

    withdraw(amount: number, fundType: FundType): void {
        const currentState = this.getCurrentState();
        switch (fundType) {
            case FundType.Taxable:
                if (amount > currentState.taxableCapital) {
                    throw new Error('Insufficient taxable capital for withdrawal');
                }
                currentState.taxableCapital -= amount;
                currentState.taxableIncome -= amount;
                const agi = this.getAGI(currentState)
                currentState.taxedIncome = currentState.taxableIncome - this.calculateTaxes(agi)
                currentState.taxedCapital = currentState.taxedIncome - currentState.taxedWithdrawals
                this.updateCurrentState(currentState)
                return
            case FundType.Taxed:
                if (amount > currentState.taxedCapital) {
                    throw new Error('Insufficient taxed capital for tax-exempt contribution');
                }
                currentState.taxedCapital -= amount;
                currentState.taxedWithdrawals += amount;
                this.updateCurrentState(currentState)
                return
            default:
                throw new Error('Invalid contribution type');

        }
    }

    getAGI(planState: PlanState): number {
        return planState.taxableIncome - planState.deductions
    }

    calculateTaxes(agi: number): number {
        return agi * (this.config.taxRate / 100)
    }

    canRetire(): boolean {
        switch (this.config.retirementStrategy) {
            case "age":
                return this.getCurrentState().age === this.config.retirementAge;
            case "debt_free":
                return this.getCurrentDebt() <= 0
            case "percent_rule":
                return this.config.retirementIncomeGoal === this.getCurrentState().retirementIncomeProjected
            case "target_savings":
                return this.config.retirementSavingsAmount === this.getCurrentState().savingsEndOfYear
        }
    }

    getCurrentDebt(): number {
        return this.managers.debtManagers.reduce((total, debtManager) => total + debtManager.getCurrentState().principalStartOfYear, 0)
    }

    getGrossIncome() {
        return this.managers.incomeManagers.reduce((grossIncome, incomeManager) => grossIncome + incomeManager.getCurrentState().grossIncome, 0)
    }

    getInflationRate(): number {
        return this.config.inflationRate
    }

    protected createNextState(previousState: PlanState): PlanState {
        const age = previousState.age + 1
        const year = previousState.year + 1
        const inflationRate = this.getInflationRate()
        return {
            ...previousState,
            age: age,
            year: year,

            grossIncome: 0,
            taxableIncome: 0,
            taxedIncome: 0,
            AGI: 0,

            taxableCapital: 0,
            taxedCapital: 0,
            taxedWithdrawals: 0,

            deductions: 0,

            electiveLimit: getTaxDeferredElectiveContributionLimit(year, age),
            deferredLimit: getTaxDeferredContributionLimit(year, age),
            iraLimit: getIraLimit(year, age),

            inflationRate: inflationRate,

            savingsTaxDeferredStartOfYear: previousState.savingsTaxDeferredEndOfYear,
            savingsTaxDeferredEndOfYear: 0,

            savingsTaxExemptStartOfYear: previousState.savingsTaxExemptEndOfYear,
            savingsTaxExemptEndOfYear: 0,

            savingsTaxableStartOfYear: previousState.savingsTaxableEndOfYear,
            savingsTaxableEndOfYear: 0,

            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear: 0,
        }
    }

    override processImplementation(planState: PlanState): PlanState {
        return planState
    }

    simulate(commands?: Command[]): PlanState[] {
        const allManagers = this.getAllManagers()
        for (let i = 0; i < 3; i++) {

            let currentState = this.getCurrentState()
            if (commands) {
                commands.forEach(command => {
                    currentState = command.execute(currentState)
                })
            }
            allManagers.forEach(manager => {
                currentState = this.processUnprocessed(manager)
            })
            this.process(currentState)
            allManagers.forEach((manager) => manager.advanceTimePeriod())
            this.advanceTimePeriod()
        }
        return this.states
    }

    processUnprocessed(manager: BaseManager<any, any>): PlanState {
        let planState = this.getCurrentState()
        const managerState = manager.getCurrentState()
        if (!managerState.processed) {
            planState = manager.process(planState)
        }
        return planState
    }
}