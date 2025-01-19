import type {Plan} from "~/models/plan/Plan";
import {ContributionLimitType, RetirementStrategy} from "~/models/plan/Plan";
import type {PlanState} from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {adjustForInsufficientFunds, getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
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
import eventBus from "~/services/eventBus";

export enum FundType {
    Taxable = "taxable",
    Taxed = "taxed",

}

export type ManagerMap = {
    cashReserveManagers: CashReserveManager[];
    debtManagers: DebtManager[];
    expenseManagers: ExpenseManager[];
    incomeManagers: IncomeManager[];
    taxDeferredInvestmentManagers: TaxDeferredInvestmentManager[];
    rothIraInvestmentManagers: RothIraInvestmentManager[];
    iraInvestmentManagers: IraInvestmentManager[];
    brokerageInvestmentManagers: BrokerageInvestmentManager[];
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

    getDebtInitial(): number {
        // TODO Test this function
        return this.config.debts.reduce((total, debt) => total + debt.principal, 0)
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
        const debtInitial = this.getDebtInitial()
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
            debtPayments: 0,
            debtPaymentsLifetime: 0,

            savingsTaxDeferredStartOfYear: savingsTaxDeferredInitial,
            savingsTaxDeferredEndOfYear: savingsTaxDeferredInitial,

            savingsTaxExemptStartOfYear: savingsTaxExemptInitial,
            savingsTaxExemptEndOfYear: savingsTaxExemptInitial,

            savingsTaxableStartOfYear: savingsTaxableInitial,
            savingsTaxableEndOfYear: savingsTaxableInitial,

            debtStartOfYear: debtInitial,
            debtEndOfYear: 0,

            savingsStartOfYear: savingsTaxDeferredInitial + savingsTaxExemptInitial + savingsTaxableInitial,
            savingsEndOfYear: 0,

            retirementIncomeProjected: 0,
            retired: false,
            processed: false,
        }
    }


    createNextState(previousState: PlanState): PlanState {
        const age = previousState.age + 1
        const year = previousState.year + 1
        const inflationRate = this.getInflationRate()
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        const taxedCapital = previousState.taxedCapital + taxedIncome
        return {
            ...previousState,
            age: age,
            year: year,

            grossIncome: grossIncome,
            taxableIncome: grossIncome,
            taxedIncome: taxedIncome,
            AGI: 0,

            taxableCapital: grossIncome,
            taxedCapital: taxedCapital,
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

            savingsTaxExemptStartOfYear: previousState.savingsTaxExemptEndOfYear,

            savingsTaxableStartOfYear: previousState.savingsTaxableEndOfYear,

            debtStartOfYear: previousState.debtEndOfYear,
            debtEndOfYear: 0,

            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear: 0,

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

    payDebt(amount: number) {
        const currentState = this.getCurrentState()
        this.updateCurrentState({
                ...currentState,
                debtPayments: currentState.debtPayments + amount,
                debtPaymentsLifetime: currentState.debtPaymentsLifetime + amount
            }
        )
    }

    adjustDebt(amount: number) {
        const currentState = this.getCurrentState()
        const debtEndOfYear = currentState.debtEndOfYear + amount;
        this.updateCurrentState({
            ...currentState,
            debtEndOfYear: debtEndOfYear
        })
    }

    invest(amount: number, contributionType: ContributionType) {
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

    withdraw(amount: number, fundType: FundType, minimum?: number): void {
        const currentState = this.getCurrentState();
        switch (fundType) {
            case FundType.Taxable:
                currentState.taxableCapital -= amount;
                currentState.taxableIncome -= amount;
                const agi = this.getAGI(currentState)
                const taxedIncome = currentState.taxableIncome - this.calculateTaxes(agi)
                const taxedCapital = currentState.taxedCapital - currentState.taxedIncome + taxedIncome
                currentState.taxedIncome = taxedIncome
                currentState.taxedCapital = taxedCapital
                this.updateCurrentState(currentState)
                return
            case FundType.Taxed:
                const taxRate = currentState.taxedCapital / currentState.taxableCapital
                currentState.taxedCapital -= amount;
                currentState.taxableCapital = taxRate > 0 ? currentState.taxedCapital / taxRate : 0
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
                return this.config.retirementSavingsAmount <= this.getCurrentState().savingsEndOfYear
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

    processImplementation(): void {
        const previousState = this.getCurrentState()
        const allManagers = this.getAllManagers()
        allManagers.forEach(manager => {
            this.processUnprocessed(manager)
        })
        this.updateCurrentState({
            ...previousState,
            savingsEndOfYear: previousState.savingsTaxDeferredEndOfYear + previousState.savingsTaxExemptEndOfYear + previousState.savingsTaxableEndOfYear,
        })
    }

    simulate(commands?: Command[], maxIterations: number = 60): PlanState[] {
        for (let i = 0; i < maxIterations; i++) {
            let manager: BaseManager<any, any> | undefined = undefined
            if (commands) {
                commands.forEach(command => {
                    manager = this.getManagerById(command.managerName, Number(command.managerId))
                    manager.process()
                })
            }
            this.process()
            if (this.canRetire()) {
                return this.states
            }
            if (i === maxIterations - 1) {
                break
            }
            this.advanceTimePeriod()
        }
        return this.states
    }

    processUnprocessed(manager: BaseManager<any, any>): void {
        const managerState = manager.getCurrentState()
        if (!managerState.processed) {
            manager.process()
        }
        manager.advanceTimePeriod()
    }

    getManagerById<T extends BaseManager<any, any>>(managerName: keyof PlanManager['managers'], id: number): T | undefined {
        this.config
        const manager = this.managers[managerName].find((manager) => manager.getConfig().id === id);
        if (manager === undefined) {
            eventBus.emit('error', {
                scope: 'planManager:missingManager',
                message: `Missing ${managerName} with ${id}`
            });
        }
        return manager as unknown as T;
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