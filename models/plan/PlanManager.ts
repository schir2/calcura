import type {Plan} from "~/types/Plan";
import {ContributionLimitType} from "~/types/Plan";
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
import {BaseOrchestrator} from "~/models/common/BaseOrchestrator";
import {ContributionError} from "~/utils/errors/ContributionError";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import eventBus from "~/services/eventBus";
import type {Command} from "~/types/Command";
import {ContributionType} from "~/types/ContributionType";

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
            income: this.config.incomes.map((income) => new IncomeManager(this, income)),
            cashReserve: this.config.cash_reserves.map((cashReserve) => new CashReserveManager(this, cashReserve)),
            expense: this.config.expenses.map((expense) => new ExpenseManager(this, expense)),
            debt: this.config.debts.map((debt) => new DebtManager(this, debt)),
            brokerage: this.config.brokerages.map((brokerage) => new BrokerageManager(this, brokerage)),
            ira: this.config.iras.map((ira) => new IraIManager(this, ira)),
            rothIra: this.config.roth_iras.map((rothIra) => new RothIraManager(this, rothIra)),
            taxDeferred: this.config.tax_deferreds.map((taxDeferred) => new TaxDeferredManager(this, taxDeferred))
        }
    }

    getSavingsTaxableInitial(): number {
        // TODO Test this function
        return this.config.brokerages.reduce((savingsTaxableStartOfYear, brokerage) => savingsTaxableStartOfYear + brokerage.initial_balance, 0)
    }

    getSavingsTaxDeferredInitial(): number {
        // TODO Test this function
        const taxDeferreds = this.config.tax_deferreds.reduce((total, taxDeferred) => total + taxDeferred.initial_balance, 0)
        const iras = this.config.iras.reduce((total, ira) => total + ira.initial_balance, 0)
        return taxDeferreds + iras
    }

    getSavingsTaxExemptInitial(): number {
        // TODO Test this function
        return this.config.roth_iras.reduce((total, brokerage) => total + brokerage.initial_balance, 0)
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
        const retirementIncomeGoal = this.config.retirement_income_goal
        return {
            age: this.config.age,
            year: this.config.year,

            gross_income: grossIncome,
            taxable_income: grossIncome,
            taxed_income: taxedIncome,
            AGI: 0,

            taxable_capital: grossIncome,
            taxed_capital: taxedIncome,
            taxed_withdrawals: 0,

            deductions: 0,

            inflation_rate: this.config.inflation_rate,

            elective_limit: getTaxDeferredElectiveContributionLimit(this.config.year, this.config.age),
            deferred_limit: getTaxDeferredContributionLimit(this.config.year, this.config.age),
            ira_limit: getIraLimit(this.config.year, this.config.age),

            tax_deferred_contributions: 0,
            taxable_contributions: 0,
            tax_exempt_contributions_lifetime: 0,
            tax_deferred_contributions_lifetime: 0,
            tax_exempt_contributions: 0,
            taxable_contributions_lifetime: 0,
            debt_payments: 0,
            debt_payments_lifetime: 0,

            savings_tax_deferred_start_of_year: savingsTaxDeferredInitial,
            savings_tax_deferred_end_of_year: savingsTaxDeferredInitial,

            savings_tax_exempt_start_of_year: savingsTaxExemptInitial,
            savings_tax_exempt_end_of_year: savingsTaxExemptInitial,

            savings_taxable_start_of_year: savingsTaxableInitial,
            savings_taxable_end_of_year: savingsTaxableInitial,

            debt_start_of_year: debtInitial,
            dept_end_of_year: 0,

            savings_start_of_year: savingsStartOfYear,
            savings_end_of_year: 0,

            expenses_paid_lifetime: 0,
            expenses_total: 0,
            expenses_paid: 0,
            expenses_shortfall: 0,
            expenses_shortfall_lifetime: 0,
            expenses_total_lifetime: 0,

            cash_reserves_total: 0,

            retirement_income_projected: 0,
            retirement_income_goal: retirementIncomeGoal,

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
        const taxedCapital = previousState.taxed_capital + taxedIncome
        const retirementIncomeGoal = this.config.retirement_income_adjusted_for_inflation ? previousState.retirement_income_goal * (1 + inflationRate / 100) : this.config.retirement_income_goal

        return {
            ...previousState,
            age: age,
            year: year,

            gross_income: grossIncome,
            taxable_income: grossIncome,
            taxed_income: taxedIncome,
            AGI: 0,

            taxable_capital: grossIncome,
            taxed_capital: taxedCapital,
            taxed_withdrawals: 0,

            deductions: 0,

            elective_limit: getTaxDeferredElectiveContributionLimit(year, age),
            deferred_limit: getTaxDeferredContributionLimit(year, age),
            ira_limit: getIraLimit(year, age),

            inflation_rate: inflationRate,

            taxable_contributions: 0,
            taxable_contributions_lifetime: previousState.taxable_contributions_lifetime,

            tax_deferred_contributions: 0,
            tax_deferred_contributions_lifetime: previousState.tax_deferred_contributions_lifetime,

            tax_exempt_contributions: 0,
            tax_exempt_contributions_lifetime: previousState.tax_exempt_contributions_lifetime,

            savings_tax_deferred_start_of_year: previousState.savings_tax_deferred_end_of_year,

            savings_tax_exempt_start_of_year: previousState.savings_tax_exempt_end_of_year,

            savings_taxable_start_of_year: previousState.savings_taxable_end_of_year,

            debt_start_of_year: previousState.dept_end_of_year,
            dept_end_of_year: 0,

            expenses_total: 0,
            expenses_paid: 0,
            expenses_shortfall: 0,
            expenses_total_lifetime: previousState.expenses_total_lifetime,
            expenses_paid_lifetime: previousState.expenses_paid_lifetime,
            expenses_shortfall_lifetime: previousState.expenses_shortfall_lifetime,

            savings_start_of_year: previousState.savings_end_of_year,
            savings_end_of_year: 0,

            cash_reserves_total: 0,

            retirement_income_projected: 0,
            retirement_income_goal: retirementIncomeGoal,

            processed: false,
        }
    }

    requestFunds(requestedAmount: number, fundType: FundType, minimum?: number): number {
        const currentState = this.getCurrentState()
        let availableFunds = 0
        switch (fundType) {
            case FundType.Taxable:
                availableFunds = Math.min(currentState.taxable_capital, requestedAmount)
                break
            case FundType.Taxed:
                availableFunds = Math.min(currentState.taxed_capital, requestedAmount)
                break
            default:
                throw new Error(`Unsupported fund type: ${fundType}`);
        }
        return adjustForInsufficientFunds(requestedAmount, availableFunds, this.config.insufficient_funds_strategy, minimum)

    }


    protected _adjustContributionLimit(currentState: PlanState, adjustment: number, contributionLimitType: ContributionLimitType): PlanState {
        if (adjustment < 0) {
            throw new ContributionError(`Adjustment must be a positive value. Received: ${adjustment}`);
        }
        const limits: Record<ContributionLimitType, number> = {
            [ContributionLimitType.Deferred]: currentState.deferred_limit,
            [ContributionLimitType.Elective]: currentState.elective_limit,
            [ContributionLimitType.Ira]: currentState.ira_limit,
        }

        if (contributionLimitType === undefined) {
            throw new ContributionError(`Unknown ContributionLimitType: ${contributionLimitType}`);
        }

        if (limits[contributionLimitType] < adjustment) {
            throw new ContributionError(`Contribution must be less than ${contributionLimitType} limit`)
        }

        switch (contributionLimitType) {
            case ContributionLimitType.Ira:
                currentState.ira_limit -= adjustment;
                break;
            case ContributionLimitType.Elective:
                currentState.elective_limit -= adjustment;
                currentState.deferred_limit -= adjustment;
                break;
            case ContributionLimitType.Deferred:
                currentState.deferred_limit -= adjustment;
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
            expenses_paid: currentState.expenses_paid + amountPaid,
            expenses_shortfall: currentState.expenses_shortfall + shortfall,
            expenses_total_lifetime: currentState.expenses_total_lifetime + amountRequested,
            expenses_total: currentState.expenses_total + amountRequested,
            expenses_paid_lifetime: currentState.expenses_paid_lifetime + amountPaid,
            expenses_shortfall_lifetime: currentState.expenses_shortfall_lifetime + shortfall,
        })
        return amountPaid

    }

    payDebt(amount: number, minimum: number) {
        const currentState = this.getCurrentState()
        this.withdraw(amount, FundType.Taxed, minimum)
        this.updateCurrentState({
                ...currentState,
                debt_payments: currentState.debt_payments + amount,
                debt_payments_lifetime: currentState.debt_payments_lifetime + amount
            }
        )
    }

    adjustDebt(amount: number) {
        const currentState = this.getCurrentState()
        const debtEndOfYear = currentState.dept_end_of_year + amount;
        this.updateCurrentState({
            ...currentState,
            dept_end_of_year: debtEndOfYear
        })
    }

    invest(amount: number, contributionType: ContributionType) {
        let currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                currentState.savings_tax_deferred_end_of_year += amount;
                break;
            case ContributionType.RothIra:
                currentState.savings_tax_exempt_end_of_year += amount;
                break;
            case ContributionType.Taxable:
                currentState.savings_taxable_end_of_year += amount;
                break;
            case ContributionType.Elective:
                currentState.savings_tax_deferred_end_of_year += amount;
                break;
            case ContributionType.Ira:
                currentState.savings_tax_deferred_end_of_year += amount;
        }
        this.updateCurrentState(currentState);
    }


    contribute(contribution: number, contributionType: ContributionType): void {
        let currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                this.adjustContributionLimit(contribution, ContributionLimitType.Deferred);
                currentState.tax_deferred_contributions += contribution;
                currentState.tax_deferred_contributions_lifetime += contribution;
                break;
            case ContributionType.RothIra:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.tax_exempt_contributions += contribution;
                currentState.tax_exempt_contributions_lifetime += contribution;
                break;
            case ContributionType.Taxable:
                currentState.taxable_contributions += contribution;
                currentState.taxable_contributions_lifetime += contribution;
                break;
            case ContributionType.Elective:
                this.adjustContributionLimit(contribution, ContributionLimitType.Elective);
                currentState.tax_deferred_contributions += contribution;
                currentState.tax_deferred_contributions_lifetime += contribution;
                break;
            case ContributionType.Ira:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.tax_deferred_contributions += contribution;
                currentState.tax_deferred_contributions_lifetime += contribution;
                break;
            case ContributionType.CashReserve:
                currentState.cash_reserves_total += contribution
                break;
        }
        this.updateCurrentState(currentState);
    }

    withdraw(amount: number, fundType: FundType, minimum?: number): void {
        const currentState = this.getCurrentState();
        switch (fundType) {
            case FundType.Taxable:
                currentState.taxable_capital -= amount;
                currentState.taxable_income -= amount;
                const agi = this.getAGI(currentState)
                const taxedIncome = currentState.taxable_income - this.calculateTaxes(agi)
                const taxedCapital = currentState.taxed_capital - currentState.taxed_income + taxedIncome
                currentState.taxed_income = taxedIncome
                currentState.taxed_capital = taxedCapital
                this.updateCurrentState(currentState)
                return
            case FundType.Taxed:
                const taxRate = currentState.taxed_capital / currentState.taxable_capital
                currentState.taxed_capital -= amount;
                currentState.taxable_capital = taxRate > 0 ? currentState.taxed_capital / taxRate : 0
                currentState.taxed_withdrawals += amount;
                this.updateCurrentState(currentState)
                return
            default:
                throw new Error('Invalid contribution type');

        }
    }

    getAGI(planState: PlanState): number {
        return planState.taxable_income - planState.deductions
    }

    calculateTaxes(agi: number): number {
        return agi * (this.config.tax_rate / 100)
    }

    canRetire(): boolean {
        const currentState = this.getCurrentState()

        switch (this.config.retirement_strategy) {
            case 'age':
                return this.getCurrentState().age === this.config.retirement_age;
            case 'debt_free':
                return this.getCurrentDebt() <= 0
            case 'percent_rule':
                return currentState.retirement_income_goal <= currentState.retirement_income_projected
            case 'target_savings':
                return this.config.retirement_savings_amount <= currentState.savings_end_of_year
        }
    }

    getCurrentDebt(): number {
        return this._managers.debt.reduce((total, debtManager) => total + debtManager.getCurrentState().principal_start_of_year, 0)
    }

    getGrossIncome() {
        return this._managers.income.reduce((grossIncome, incomeManager) => grossIncome + incomeManager.getCurrentState().gross_income, 0)
    }

    getInflationRate(): number {
        return this.config.inflation_rate
    }

    processImplementation(): void {
        const allManagers = this.getAllManagers()
        // this.managers.income.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.debt.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.expense.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.cashReserve.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.taxDeferred.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.rothIra.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.ira.forEach((manager) => this.processUnprocessed(manager))
        // this.managers.brokerage.forEach((manager) => this.processUnprocessed(manager))
        // allManagers.forEach(manager => {
        //     this.processUnprocessed(manager)
        // })
        const previousState = this.getCurrentState()

        const savingsEndOfYear = previousState.savings_tax_deferred_end_of_year + previousState.savings_tax_exempt_end_of_year + previousState.savings_taxable_end_of_year + previousState.taxed_capital;
        const projectedIncome = savingsEndOfYear * (this.config.retirement_withdrawal_rate / 100)
        this.updateCurrentState({
            ...previousState,
            savings_end_of_year: savingsEndOfYear,
            retirement_income_projected: projectedIncome,
        })
    }

    getCommands(): Command[] {
        if (this.config.command_sequences.length > 0) {
            return this.config.command_sequences[0].commands
        }
        return []
    }

    getCommandsForSequence(commandSequenceId: number): Command[] {
        return this.config.command_sequences.find((commandSequence) => commandSequence.id === commandSequenceId)?.commands ?? []
    }

    simulate(commandSequenceId?: number, maxIterations: number = 60): PlanState[] {
        this.reset()
        const commands = commandSequenceId ? this.getCommandsForSequence(commandSequenceId) : []
        maxIterations = Math.min(maxIterations, this.config.life_expectancy - this.config.age + 1)
        for (let i = 0; i < maxIterations; i++) {
            let manager: BaseManager<any, any> | undefined = undefined
            if (commands) {
                commands.forEach(command => {
                    if (command.is_active) {
                        manager = this.getManagerById(command.item_type, Number(command.model_id))
                        manager?.process()
                        manager?.advanceTimePeriod()
                    }
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
                return currentState.ira_limit
            case ContributionLimitType.Elective:
                return currentState.elective_limit
            case ContributionLimitType.Deferred:
                return currentState.deferred_limit
        }
    }
}