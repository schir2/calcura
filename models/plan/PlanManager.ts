import type {Plan} from "~/types/Plan";
import {ContributionLimitType, RetirementStrategy} from "~/types/Plan";
import type {PlanState} from "~/types/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {
    adjustForInsufficientFunds,
    getIraLimit,
    getTaxDeferredContributionLimit,
    getTaxDeferredElectiveContributionLimit
} from "~/utils";
import {IncomeManager} from "~/models/income/IncomeManager";
import {BrokerageManager} from "~/models/brokerage/BrokerageManager";
import {ExpenseManager} from "~/models/expense/ExpenseManager";
import {IraIManager} from "~/models/ira/IraIManager";
import {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
import {ContributionType} from "~/models/common";
import {BaseOrchestrator} from "~/models/common/BaseOrchestrator";
import {ContributionError} from "~/utils/errors/ContributionError";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import eventBus from "~/services/eventBus";
import type {Command} from "~/types/Command";

export enum FundType {
    Taxable = "taxable",
    Taxed = "taxed",
}

export type PlanManagers = {
    expense: ExpenseManager[];
    cashReserve: CashReserveManager[];
    debt: DebtManager[];
    income: IncomeManager[];
    taxDeferred: TaxDeferredManager[];
    rothIra: RothIraManager[];
    ira: IraIManager[];
    brokerage: BrokerageManager[];
};


export default class PlanManager extends BaseOrchestrator<Plan, PlanState, PlanManagers> {

    createManagers(): PlanManagers {
        return {
            income: this.config.income.map((income) => new IncomeManager(this, income)),
            cashReserve: this.config.cashReserve.map((cashReserve) => new CashReserveManager(this, cashReserve)),
            expense: this.config.expenses.map((expense) => new ExpenseManager(this, expense)),
            debt: this.config.debts.map((debt) => new DebtManager(this, debt)),
            brokerage: this.config.brokerage.map((brokerage) => new BrokerageManager(this, brokerage)),
            ira: this.config.ira.map((ira) => new IraIManager(this, ira)),
            rothIra: this.config.rothIra.map((rothIra) => new RothIraManager(this, rothIra)),
            taxDeferred: this.config.taxDeferred.map((taxDeferred) => new TaxDeferredManager(this, taxDeferred))
        }
    }

    getSavingsTaxableInitial(): number {
        // TODO Test this function
        return this.config.brokerage.reduce((savingsTaxableStartOfYear, brokerage) => savingsTaxableStartOfYear + brokerage.initialBalance, 0)
    }

    getSavingsTaxDeferredInitial(): number {
        // TODO Test this function
        const taxDeferreds = this.config.taxDeferred.reduce((total, taxDeferred) => total + taxDeferred.initialBalance, 0)
        const iras = this.config.ira.reduce((total, ira) => total + ira.initialBalance, 0)
        return taxDeferreds + iras
    }

    getSavingsTaxExemptInitial(): number {
        // TODO Test this function
        return this.config.rothIra.reduce((total, brokerage) => total + brokerage.initialBalance, 0)
    }

    getDebtInitial(): number {
        // TODO Test this function
        return this.config.debts.reduce((total, debt) => total + debt.principal, 0)
    }

    getAnnualExpenseTotal(): number {
        return this.managers.expense.reduce((total, expenseManager) => total + expenseManager.calculatePayment(), 0)
    }

    protected createInitialState(): PlanState {
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        const savingsTaxableInitial = this.getSavingsTaxableInitial()
        const savingsTaxExemptInitial = this.getSavingsTaxExemptInitial()
        const savingsTaxDeferredInitial = this.getSavingsTaxDeferredInitial()
        const debtInitial = this.getDebtInitial()
        const savingsStartOfYear = savingsTaxDeferredInitial + savingsTaxExemptInitial + savingsTaxableInitial;
        const retirementIncomeGoal = this.config.retirementIncomeGoal
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

            savingsStartOfYear: savingsStartOfYear,
            savingsEndOfYear: 0,

            expensesPaidLifetime: 0,
            expensesTotal: 0,
            expensesPaid: 0,
            expensesShortfall: 0,
            expensesShortfallLifetime: 0,
            expensesTotalLifetime: 0,

            retirementIncomeProjected: 0,
            retirementIncomeGoal: retirementIncomeGoal,

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
        const retirementIncomeGoal = this.config.retirementIncomeAdjustedForInflation ? previousState.retirementIncomeGoal * (1 + inflationRate / 100) : this.config.retirementIncomeGoal

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

            expensesTotal: 0,
            expensesPaid: 0,
            expensesShortfall: 0,
            expensesPaidLifetime: previousState.expensesPaidLifetime,
            expensesShortfallLifetime: previousState.expensesShortfallLifetime,

            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear: 0,

            retirementIncomeProjected: 0,
            retirementIncomeGoal: retirementIncomeGoal,

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

    requestAndPayExpense(amountRequested: number): number {
        const currentState = this.getCurrentState()
        const amountPaid = this.requestFunds(amountRequested, FundType.Taxed)
        const shortfall = amountRequested - amountPaid
        this.withdraw(amountPaid, FundType.Taxed)
        this.updateCurrentState({
            ...currentState,
            expensesPaid: currentState.expensesPaid + amountPaid,
            expensesShortfall: currentState.expensesShortfall + shortfall,
            expensesTotal: currentState.expensesTotal + amountRequested,
            expensesPaidLifetime: currentState.expensesPaidLifetime + amountPaid,
            expensesShortfallLifetime: currentState.expensesShortfallLifetime + shortfall,
        })
        return amountPaid

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
        const currentState = this.getCurrentState()

        switch (this.config.retirementStrategy) {
            case RetirementStrategy.Age:
                return this.getCurrentState().age === this.config.retirementAge;
            case RetirementStrategy.DebtFree:
                return this.getCurrentDebt() <= 0
            case RetirementStrategy.PercentRule:
                return currentState.retirementIncomeGoal <= currentState.retirementIncomeProjected
            case RetirementStrategy.TargetSavings:
                return this.config.retirementSavingsAmount <= currentState.savingsEndOfYear
        }
    }

    getCurrentDebt(): number {
        return this._managers.debt.reduce((total, debtManager) => total + debtManager.getCurrentState().principalStartOfYear, 0)
    }

    getGrossIncome() {
        return this._managers.income.reduce((grossIncome, incomeManager) => grossIncome + incomeManager.getCurrentState().grossIncome, 0)
    }

    getInflationRate(): number {
        return this.config.inflationRate
    }

    processImplementation(): void {
        const allManagers = this.getAllManagers()
        this.managers.income.forEach((manager) => this.processUnprocessed(manager))
        this.managers.debt.forEach((manager) => this.processUnprocessed(manager))
        this.managers.expense.forEach((manager) => this.processUnprocessed(manager))
        this.managers.cashReserve.forEach((manager) => this.processUnprocessed(manager))
        this.managers.taxDeferred.forEach((manager) => this.processUnprocessed(manager))
        this.managers.rothIra.forEach((manager) => this.processUnprocessed(manager))
        this.managers.ira.forEach((manager) => this.processUnprocessed(manager))
        this.managers.brokerage.forEach((manager) => this.processUnprocessed(manager))
        // allManagers.forEach(manager => {
        //     this.processUnprocessed(manager)
        // })
        const previousState = this.getCurrentState()

        const savingsEndOfYear = previousState.savingsTaxDeferredEndOfYear + previousState.savingsTaxExemptEndOfYear + previousState.savingsTaxableEndOfYear + previousState.taxedCapital;
        const projectedIncome = savingsEndOfYear * (this.config.retirementWithdrawalRate / 100)
        this.updateCurrentState({
            ...previousState,
            savingsEndOfYear: savingsEndOfYear,
            retirementIncomeProjected: projectedIncome,
        })
    }

    getCommands(): Command[] {
        if (this.config.commandSequences.length > 0) {
            return this.config.commandSequences[0].commands
        }
        return []
    }

    simulate(commands?: Command[], maxIterations: number = 60): PlanState[] {
        maxIterations = Math.min(maxIterations, this.config.lifeExpectancy - this.config.age + 1)
        for (let i = 0; i < maxIterations; i++) {
            let manager: BaseManager<any, any> | undefined = undefined
            if (commands) {
                commands.forEach(command => {
                    manager = this.getManagerById(command.modelName, Number(command.modelId))
                    manager?.process()
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

    getManagerById<T extends BaseManager<any, any>>(managerName: keyof PlanManager['managers'], id: number): T {
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