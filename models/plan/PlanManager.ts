import type {Plan} from "~/models/plan/Plan";
import {ContributionLimitType, RetirementStrategy} from "~/models/plan/Plan";
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
import {IncomeManager} from "~/models/income/IncomeManager";
import {BrokerageInvestmentManager} from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import {ExpenseManager} from "~/models/expense/ExpenseManager";
import {IraInvestmentManager} from "~/models/iraInvestment/IraInvestmentManager";
import {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import {TaxDeferredInvestmentManager} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";
import {ContributionType} from "~/models/common";
import {BaseOrchestrator} from "~/models/common/BaseOrchestrator";
import {ContributionError} from "~/utils/errors/ContributionError";
import {RothIraInvestmentManager} from "~/models/rothIraInvestment/RothIraInvestmentManager";

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
    rothIraInvestmentManagers: RothIraInvestmentManager[];
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
            rothIraInvestmentManagers: this.config.rothIraInvestments.map((rothIraInvestment) => new RothIraInvestmentManager(this, rothIraInvestment)),
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
        return this.config.rothIraInvestments.reduce((total, brokerageInvestment) => total + brokerageInvestment.initialBalance, 0)
    }

    getAnnualExpenseTotal(): number {
        return this.managers.expenseManagers.reduce((total, expenseManager) => total + expenseManager.calculatePayment(), 0)
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

            taxDeferredContributions: 0,
            taxableContributions: 0,
            taxExemptContributionsLifetime: 0,
            taxDeferredContributionsLifetime: 0,
            taxExemptContributions: 0,
            taxableContributionsLifetime: 0,

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


    protected _adjustContributionLimit(currentState: PlanState, adjustment: number, contributionLimitType: ContributionLimitType): PlanState {
        if (adjustment < 0) {
            throw new ContributionError(`Adjustment must be a positive value. Received: ${adjustment}`);
        }
        const limits: Record<ContributionLimitType, number> = {
            [ContributionLimitType.Deferred]: currentState.deferredLimit,
            [ContributionLimitType.Elective]: currentState.electiveLimit,
            [ContributionLimitType.Ira]: currentState.iraLimit,
        }

        if (contributionLimitType === undefined) {
            throw new ContributionError(`Unknown ContributionLimitType: ${contributionLimitType}`);
        }

        if (limits[contributionLimitType] < adjustment) {
            throw new ContributionError(`Contribution must be less than ${contributionLimitType} limit`)
        }

        switch (contributionLimitType) {
            case ContributionLimitType.Ira:
                currentState.iraLimit -= adjustment;
                break;
            case ContributionLimitType.Elective:
                currentState.electiveLimit -= adjustment;
                currentState.deferredLimit -= adjustment;
                break;
            case ContributionLimitType.Deferred:
                currentState.deferredLimit -= adjustment;
                break;
        }
        return currentState
    }

    private adjustContributionLimit(adjustment: number, contributionLimitType: ContributionLimitType) {
        const currentState = this.getCurrentState()
        const newState = this._adjustContributionLimit(currentState, adjustment, contributionLimitType)
        this.updateCurrentState(newState)
    }

    invest(amount: number, contributionType: ContributionType){
        let currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                currentState.savingsTaxDeferredEndOfYear += amount;
                break;
            case ContributionType.RothIra:
                currentState.savingsTaxExemptEndOfYear += amount;
                break;
            case ContributionType.Taxable:
                currentState.savingsTaxableEndOfYear += amount;
                break;
            case ContributionType.Elective:
                currentState.savingsTaxDeferredEndOfYear += amount;
                break;
            case ContributionType.Ira:
                currentState.savingsTaxDeferredEndOfYear += amount;
        }
        this.updateCurrentState(currentState);
    }


    contribute(contribution: number, contributionType: ContributionType): void {
        let currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                this.adjustContributionLimit(contribution, ContributionLimitType.Deferred);
                currentState.taxDeferredContributions += contribution;
                currentState.taxDeferredContributionsLifetime += contribution;
                break;
            case ContributionType.RothIra:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.taxExemptContributions += contribution;
                currentState.taxExemptContributionsLifetime += contribution;
                break;
            case ContributionType.Taxable:
                currentState.taxableContributions += contribution;
                currentState.taxableContributionsLifetime += contribution;
                break;
            case ContributionType.Elective:
                this.adjustContributionLimit(contribution, ContributionLimitType.Elective);
                currentState.taxDeferredContributions += contribution;
                currentState.taxDeferredContributionsLifetime += contribution;
                break;
            case ContributionType.Ira:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.taxDeferredContributions += contribution;
                currentState.taxDeferredContributionsLifetime += contribution;
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

            taxableContributions: 0,
            taxableContributionsLifetime: previousState.taxableContributionsLifetime,

            taxDeferredContributions: 0,
            taxDeferredContributionsLifetime: previousState.taxDeferredContributionsLifetime,

            taxExemptContributions: 0,
            taxExemptContributionsLifetime: previousState.taxExemptContributionsLifetime,

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

    getRothIraManagerById(id: number): RothIraInvestmentManager {
        const rothIraManager = this.managers.rothIraInvestmentManagers.find((rothIraManager) => rothIraManager.getConfig().id === id);
        if (rothIraManager === undefined) {
            throw new Error(`Missing tax deferred investment manager with id ${id}`);
        }
        return rothIraManager
    }

    getExpenseManagerById(id: number): ExpenseManager {
        const expenseManager = this.managers.expenseManagers.find((expenseManager) => expenseManager.getConfig().id === id);
        if (expenseManager === undefined) {
            throw new Error(`Missing tax deferred investment manager with id ${id}`);
        }
        return expenseManager
    }

    getDebtManagerById(id: number): DebtManager {
        const debtManager = this.managers.debtManagers.find((debtManager) => debtManager.getConfig().id === id);
        if (debtManager === undefined) {
            throw new Error(`Missing tax deferred investment manager with id ${id}`);
        }
        return debtManager
    }

    getCashReserveManagerById(id: number): CashReserveManager {
        const cashReserveManager = this.managers.cashReserveManagers.find((cashReserveManager) => cashReserveManager.getConfig().id === id);
        if (cashReserveManager === undefined) {
            throw new Error(`Missing tax cash reserve manager with id ${id}`);
        }
        return cashReserveManager
    }

    getLimitForContributionType(contributionLimitType: ContributionLimitType) {
        const currentState = this.getCurrentState()
        switch (contributionLimitType) {
            case ContributionLimitType.Ira:
                return currentState.iraLimit
            case ContributionLimitType.Elective:
                return currentState.electiveLimit
            case ContributionLimitType.Deferred:
                return currentState.deferredLimit
        }
    }
}