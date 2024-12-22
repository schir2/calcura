import type {Plan} from "~/models/plan/Plan";
import {RetirementStrategy} from "~/models/plan/Plan";
import type {PlanState} from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {
    adjustForInsufficientFunds,
    getIraLimit,
    getTaxDeferredContributionLimit,
    getTaxDeferredElectiveContributionLimit
} from "~/utils";
import type Command from "~/models/common/Command";
import IncomeManager from "~/models/income/IncomeManager";
import BrokerageInvestmentManager from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import ExpenseManager from "~/models/expense/ExpenseManager";
import IraInvestmentManager from "~/models/iraInvestment/IraInvestmentManager";
import CashReserveManager from "~/models/cashReserve/CashReserveManager";
import TaxDeferredInvestmentManager from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";
import {ContributionType} from "~/models/common";
import {BaseOrchestrator} from "~/models/common/BaseOrchestrator";

export enum FundType {
    Taxable = "taxable",
    Taxed = "taxed",

}

type ManagerMap = {
    incomeManagers: IncomeManager[];
    cashReserveManagers: CashReserveManager[];
    expenseManagers: ExpenseManager[];
    debtManagers: DebtManager[];
    brokerageInvestmentManagers: BrokerageInvestmentManager[];
    iraInvestmentManagers: IraInvestmentManager[];
    // rothIraInvestmentManagers: RothIraInvestmentManager[];
    taxDeferredInvestmentManagers: TaxDeferredInvestmentManager[];
};


export default class PlanManager extends BaseOrchestrator<Plan, PlanState, ManagerMap> {

    createManagers(): ManagerMap {
        return {
            incomeManagers: this.config.incomes.map((income) => new IncomeManager(this, income)),
            cashReserveManagers: this.config.cashReserves.map((cashReserve) => new CashReserveManager(this, cashReserve)),
            expenseManagers: this.config.expenses.map((expense) => new ExpenseManager(this, expense)),
            debtManagers: this.config.debts.map((debt) => new DebtManager(this, debt)),
            brokerageInvestmentManagers: this.config.brokerageInvestments.map((brokerageInvestment) => new BrokerageInvestmentManager(this, brokerageInvestment)),
            iraInvestmentManagers: this.config.iraInvestments.map((iraInvestment) => new IraInvestmentManager(this, iraInvestment)),
            taxDeferredInvestmentManagers: this.config.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestmentManager(this, taxDeferredInvestment))
        }
    }

    getSavingsTaxableInitial(): number {
        // TODO Test this function
        return this.config.brokerageInvestments.reduce((savingsTaxableStartOfYear, brokerageInvestment) => savingsTaxableStartOfYear + brokerageInvestment.initialBalance, 0)
    }

    getSavingsTaxDeferredInitial(): number {
        // TODO Test this function
        const taxDeferredInvestments = this.config.taxDeferredInvestments.reduce((total, taxDeferredInvestment) => total + taxDeferredInvestment.initialBalance, 0)
        const iraInvestments = this.config.iraInvestments.reduce((total, iraInvestment) => total + iraInvestment.initialBalance, 0)
        return taxDeferredInvestments + iraInvestments
    }

    getSavingsTaxExemptInitial(): number {
        // TODO Test this function
        // return this.config.iraInvestments.reduce((savingsTaxDeferredStartOfYear, brokerageInvestment) => savingsTaxDeferredStartOfYear + brokerageInvestment.initialBalance, 0)
        return 0
    }

    protected createInitialState(): PlanState {
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        const savingsTaxableInitial = this.getSavingsTaxableInitial()
        const savingsTaxExemptInitial = this.getSavingsTaxExemptInitial()
        const savingsTaxDeferredInitial = this.getSavingsTaxDeferredInitial()
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

            savingsTaxDeferredStartOfYear: savingsTaxDeferredInitial,
            savingsTaxDeferredEndOfYear: savingsTaxDeferredInitial,

            savingsTaxExemptStartOfYear: savingsTaxExemptInitial,
            savingsTaxExemptEndOfYear: savingsTaxExemptInitial,

            savingsTaxableStartOfYear: savingsTaxableInitial,
            savingsTaxableEndOfYear: savingsTaxableInitial,

            savingsStartOfYear: 0,
            savingsEndOfYear: 0,

            retirementIncomeProjected: 0,
            retired: false,

            processed: false,
        }
    }

    requestFunds(requestedAmount: number, fundType: FundType, minimum?: number): number {
        const currentState = this.getCurrentState()
        let availableFunds = 0
        switch (fundType) {
            case FundType.Taxable:
                availableFunds = Math.min(currentState.taxableCapital, requestedAmount)
                break
            case FundType.Taxed:
                availableFunds = Math.min(currentState.taxedCapital, requestedAmount)
                break
            default:
                throw new Error(`Unsupported fund type: ${fundType}`);
        }
        return adjustForInsufficientFunds(requestedAmount, availableFunds, this.config.insufficientFundsStrategy, minimum)

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
            case RetirementStrategy.Age:
                return this.getCurrentState().age === this.config.retirementAge;
            case RetirementStrategy.DebtFree:
                return this.getCurrentDebt() <= 0
            case RetirementStrategy.PercentRule:
                return this.config.retirementIncomeGoal === this.getCurrentState().retirementIncomeProjected
            case RetirementStrategy.TargetSavings:
                return this.config.retirementSavingsAmount === this.getCurrentState().savingsEndOfYear
        }
    }

    getCurrentDebt(): number {
        return this._managers.debtManagers.reduce((total, debtManager) => total + debtManager.getCurrentState().principalStartOfYear, 0)
    }

    getGrossIncome() {
        return this._managers.incomeManagers.reduce((grossIncome, incomeManager) => grossIncome + incomeManager.getCurrentState().grossIncome, 0)
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
                    command.execute()
                })
            }
            allManagers.forEach(manager => {
                this.processUnprocessed(manager)
            })
            this.process(currentState)
            allManagers.forEach((manager) => manager.advanceTimePeriod())
            this.advanceTimePeriod()
        }
        return this.states
    }

    processUnprocessed(manager: BaseManager<any, any>): void {
        let planState = this.getCurrentState()
        const managerState = manager.getCurrentState()
        if (!planState.processed) {
            manager.process()
        }
    }

    getIncomeManagerById(id: number): IncomeManager {
        const incomeManager = this.managers.incomeManagers.find((incomeManager) => incomeManager.getConfig().id === id);
        if (incomeManager === undefined) {
            throw new Error(`Missing income manager with id ${id}`);
        }
        return incomeManager
    }

    getTaxDeferredManagerById(id: number): TaxDeferredInvestmentManager {
        const taxDeferredManager = this.managers.taxDeferredInvestmentManagers.find((taxDeferredManager) => taxDeferredManager.getConfig().id === id);
        if (taxDeferredManager === undefined) {
            throw new Error(`Missing tax deferred investment manager with id ${id}`);
        }
        return taxDeferredManager
    }

    getIraManagerById(id: number): IraInvestmentManager {
        const iraManager = this.managers.iraInvestmentManagers.find((iraManager) => iraManager.getConfig().id === id);
        if (iraManager === undefined) {
            throw new Error(`Missing tax deferred investment manager with id ${id}`);
        }
        return iraManager
    }
}