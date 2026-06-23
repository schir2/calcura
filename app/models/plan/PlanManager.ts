import type {PlanWithRelations} from "#shared/types/Plan";
import {ContributionLimitType} from "#shared/types/Plan";
import type {OrchestratorState} from "#shared/types/OrchestratorState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {
    adjustForInsufficientFunds,
    getHsaLimit,
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
import eventBus from "~/utils/eventBus";
import type {Command} from "#shared/types/Command";
import {ContributionType} from "#shared/types/ContributionType";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {ModelName} from "#shared/types/ModelName";
import {HsaManager} from "~/models/hsa/HsaManager";

export enum FundType {
    Taxable = "taxable",
    Taxed = "taxed",
}

export type PlanManagers = {
    expense: ExpenseManager[];
    cash_reserve: CashReserveManager[];
    debt: DebtManager[];
    income: IncomeManager[];
    tax_deferred: TaxDeferredManager[];
    roth_ira: RothIraManager[];
    ira: IraIManager[];
    brokerage: BrokerageManager[];
    hsa: HsaManager[];
}


export default class PlanManager extends BaseOrchestrator<PlanWithRelations, OrchestratorState, PlanManagers> {

    createManagers(): PlanManagers {
        return {
            income: this.config.incomes.map((income) => new IncomeManager(this, income)),
            cash_reserve: this.config.cash_reserves.map((cashReserve) => new CashReserveManager(this, cashReserve)),
            expense: this.config.expenses.map((expense) => new ExpenseManager(this, expense)),
            debt: this.config.debts.map((debt) => new DebtManager(this, debt)),
            brokerage: this.config.brokerages.map((brokerage) => new BrokerageManager(this, brokerage)),
            ira: this.config.iras.map((ira) => new IraIManager(this, ira)),
            roth_ira: this.config.roth_iras.map((rothIra) => new RothIraManager(this, rothIra)),
            tax_deferred: this.config.tax_deferreds.map((taxDeferred) => new TaxDeferredManager(this, taxDeferred)),
            hsa: this.config.hsas.map((hsa) => new HsaManager(this, hsa)),
        }
    }

    getSavingsTaxableInitial(): number {
        return this.config.brokerages.reduce((total, brokerage) => total + brokerage.initial_balance, 0)
    }

    getSavingsTaxDeferredInitial(): number {
        const taxDeferreds = this.config.tax_deferreds.reduce((total, taxDeferred) => total + taxDeferred.initial_balance, 0)
        const iras = this.config.iras.reduce((total, ira) => total + ira.initial_balance, 0)
        return taxDeferreds + iras
    }

    getSavingsTaxExemptInitial(): number {
        return this.config.roth_iras.reduce((total, rothIra) => total + rothIra.initial_balance, 0)
    }

    getDebtInitial(): number {
        return this.config.debts.reduce((total, debt) => total + debt.principal, 0)
    }

    getAnnualExpenseTotal(): number {
        return this.managers.expense.reduce((total, expenseManager) => total + expenseManager.calculatePayment(), 0)
    }

    protected createInitialState(): OrchestratorState {
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        const savingsTaxableInitial = this.getSavingsTaxableInitial()
        const savingsTaxExemptInitial = this.getSavingsTaxExemptInitial()
        const savingsTaxDeferredInitial = this.getSavingsTaxDeferredInitial()
        const debtInitial = this.getDebtInitial()
        return {
            processed: false,
            retired: false,

            plan: {
                age: this.config.age,
                year: this.config.year,
                inflation_rate: this.config.inflation_rate,
                retirement_income_projected: 0,
                retirement_income_goal: this.config.retirement_income_goal,
            },

            income: {
                gross: grossIncome,
                taxable: grossIncome,
                net: taxedIncome,
                agi: 0,
                gross_lifetime: 0,
                taxable_lifetime: 0,
                net_lifetime: 0,
                agi_lifetime: 0,
            },

            cash: {
                taxable: grossIncome,
                net: taxedIncome,
                spent: 0,
            },

            limits: {
                elective: getTaxDeferredElectiveContributionLimit(this.config.year, this.config.age),
                employer: 0,
                deferred: getTaxDeferredContributionLimit(this.config.year, this.config.age),
                ira: getIraLimit(this.config.year, this.config.age),
                hsa: getHsaLimit(this.config.year, this.config.age),
            },

            assets: {
                tax_deferred: {
                    contribution: 0,
                    contribution_lifetime: 0,
                    balance_start: savingsTaxDeferredInitial,
                    balance_end: savingsTaxDeferredInitial,
                },
                taxable: {
                    contribution: 0,
                    contribution_lifetime: 0,
                    balance_start: savingsTaxableInitial,
                    balance_end: savingsTaxableInitial,
                },
                tax_exempt: {
                    contribution: 0,
                    contribution_lifetime: 0,
                    balance_start: savingsTaxExemptInitial,
                    balance_end: savingsTaxExemptInitial,
                },
                cash_reserve: {
                    contribution: 0,
                    contribution_lifetime: 0,
                    balance_start: 0,
                    balance_end: 0,
                },
            },

            liabilities: {
                debt: {
                    balance_start: debtInitial,
                    balance_end: 0,
                    paid: 0,
                    shortfall: 0,
                    paid_lifetime: 0,
                    shortfall_lifetime: 0,
                    interest_accrued: 0,
                    interest_accrued_lifetime: 0,
                },
                expense: {
                    balance_start: this.getAnnualExpenseTotal(),
                    balance_end: 0,
                    paid: 0,
                    shortfall: 0,
                    paid_lifetime: 0,
                    shortfall_lifetime: 0,
                },
            },
        }
    }


    createNextState(previousState: OrchestratorState): OrchestratorState {
        const age = previousState.plan.age + 1
        const year = previousState.plan.year + 1
        const inflationRate = this.getInflationRate()
        const grossIncome = this.getGrossIncome()
        const taxedIncome = grossIncome - this.calculateTaxes(grossIncome)
        const taxedCapital = previousState.cash.net + taxedIncome
        const retirementIncomeGoal = this.config.retirement_income_adjusted_for_inflation
            ? previousState.plan.retirement_income_goal * (1 + inflationRate / 100)
            : this.config.retirement_income_goal

        return {
            ...previousState,
            processed: false,

            plan: {
                age,
                year,
                inflation_rate: inflationRate,
                retirement_income_projected: 0,
                retirement_income_goal: retirementIncomeGoal,
            },

            income: {
                gross: grossIncome,
                taxable: grossIncome,
                net: taxedIncome,
                agi: 0,
                gross_lifetime: previousState.income.gross_lifetime,
                taxable_lifetime: previousState.income.taxable_lifetime,
                net_lifetime: previousState.income.net_lifetime,
                agi_lifetime: previousState.income.agi_lifetime,
            },

            cash: {
                taxable: grossIncome,
                net: taxedCapital,
                spent: 0,
            },

            limits: {
                elective: getTaxDeferredElectiveContributionLimit(year, age),
                employer: 0,
                deferred: getTaxDeferredContributionLimit(year, age),
                ira: getIraLimit(year, age),
                hsa: getHsaLimit(year, age),
            },

            assets: {
                tax_deferred: {
                    ...previousState.assets.tax_deferred,
                    contribution: 0,
                    balance_start: previousState.assets.tax_deferred.balance_end,
                    balance_end: previousState.assets.tax_deferred.balance_end,
                },
                taxable: {
                    ...previousState.assets.taxable,
                    contribution: 0,
                    balance_start: previousState.assets.taxable.balance_end,
                    balance_end: previousState.assets.taxable.balance_end,
                },
                tax_exempt: {
                    ...previousState.assets.tax_exempt,
                    contribution: 0,
                    balance_start: previousState.assets.tax_exempt.balance_end,
                    balance_end: previousState.assets.tax_exempt.balance_end,
                },
                cash_reserve: {
                    ...previousState.assets.cash_reserve,
                    contribution: 0,
                    balance_start: previousState.assets.cash_reserve.balance_end,
                    balance_end: previousState.assets.cash_reserve.balance_end,
                },
            },

            liabilities: {
                debt: {
                    ...previousState.liabilities.debt,
                    balance_start: previousState.liabilities.debt.balance_end,
                    balance_end: 0,
                    paid: 0,
                    shortfall: 0,
                    interest_accrued: 0,
                },
                expense: {
                    balance_start: this.getAnnualExpenseTotal(),
                    balance_end: 0,
                    paid: 0,
                    shortfall: 0,
                    paid_lifetime: previousState.liabilities.expense.paid_lifetime,
                    shortfall_lifetime: previousState.liabilities.expense.shortfall_lifetime,
                },
            },
        }
    }

    requestFunds(requestedAmount: number, fundType: FundType, minimum?: number): number {
        const currentState = this.getCurrentState()
        let availableFunds = 0
        switch (fundType) {
            case FundType.Taxable:
                availableFunds = Math.min(currentState.cash.taxable, requestedAmount)
                break
            case FundType.Taxed:
                availableFunds = Math.min(currentState.cash.net, requestedAmount)
                break
            default:
                throw new Error(`Unsupported fund type: ${fundType}`);
        }
        return adjustForInsufficientFunds(requestedAmount, availableFunds, this.config.insufficient_funds_strategy, minimum)
    }


    protected _adjustContributionLimit(currentState: OrchestratorState, adjustment: number, contributionLimitType: ContributionLimitType): OrchestratorState {
        if (adjustment < 0) {
            throw new ContributionError(`Adjustment must be a positive value. Received: ${adjustment}`);
        }
        const limits: Record<ContributionLimitType, number> = {
            [ContributionLimitType.Deferred]: currentState.limits.deferred,
            [ContributionLimitType.Elective]: currentState.limits.elective,
            [ContributionLimitType.Ira]: currentState.limits.ira,
            [ContributionLimitType.Hsa]: currentState.limits.hsa,
        }

        if (contributionLimitType === undefined) {
            throw new ContributionError(`Unknown ContributionLimitType: ${contributionLimitType}`);
        }

        if (limits[contributionLimitType] < adjustment) {
            throw new ContributionError(`Contribution must be less than ${contributionLimitType} limit`)
        }

        switch (contributionLimitType) {
            case ContributionLimitType.Ira:
                currentState.limits.ira -= adjustment;
                break;
            case ContributionLimitType.Elective:
                currentState.limits.elective -= adjustment;
                currentState.limits.deferred -= adjustment;
                break;
            case ContributionLimitType.Deferred:
                currentState.limits.deferred -= adjustment;
                break;
            case ContributionLimitType.Hsa:
                currentState.limits.hsa -= adjustment;
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
        const amountPaid = this.requestFunds(amountRequested, FundType.Taxed)
        const shortfall = amountRequested - amountPaid
        this.withdraw(amountPaid, FundType.Taxed)
        const currentState = this.getCurrentState()
        this.updateCurrentState({
            ...currentState,
            liabilities: {
                ...currentState.liabilities,
                expense: {
                    ...currentState.liabilities.expense,
                    paid: currentState.liabilities.expense.paid + amountPaid,
                    shortfall: currentState.liabilities.expense.shortfall + shortfall,
                    balance_end: currentState.liabilities.expense.shortfall + shortfall,
                    paid_lifetime: currentState.liabilities.expense.paid_lifetime + amountPaid,
                    shortfall_lifetime: currentState.liabilities.expense.shortfall_lifetime + shortfall,
                }
            }
        })
        return amountPaid
    }

    payDebt(amount: number, minimum: number) {
        this.withdraw(amount, FundType.Taxed, minimum)
        const currentState = this.getCurrentState()
        this.updateCurrentState({
            ...currentState,
            liabilities: {
                ...currentState.liabilities,
                debt: {
                    ...currentState.liabilities.debt,
                    paid: currentState.liabilities.debt.paid + amount,
                    paid_lifetime: currentState.liabilities.debt.paid_lifetime + amount,
                }
            }
        })
    }

    adjustDebt(amount: number) {
        const currentState = this.getCurrentState()
        this.updateCurrentState({
            ...currentState,
            liabilities: {
                ...currentState.liabilities,
                debt: {
                    ...currentState.liabilities.debt,
                    balance_end: currentState.liabilities.debt.balance_end + amount,
                }
            }
        })
    }

    accrueDebtInterest(amount: number): void {
        const currentState = this.getCurrentState()
        this.updateCurrentState({
            ...currentState,
            liabilities: {
                ...currentState.liabilities,
                debt: {
                    ...currentState.liabilities.debt,
                    interest_accrued: currentState.liabilities.debt.interest_accrued + amount,
                    interest_accrued_lifetime: currentState.liabilities.debt.interest_accrued_lifetime + amount,
                }
            }
        })
    }

    invest(amount: number, contributionType: ContributionType) {
        const currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
            case ContributionType.Elective:
            case ContributionType.Ira:
            case ContributionType.Hsa:
                currentState.assets.tax_deferred.balance_end += amount;
                break;
            case ContributionType.RothIra:
                currentState.assets.tax_exempt.balance_end += amount;
                break;
            case ContributionType.Taxable:
                currentState.assets.taxable.balance_end += amount;
                break;
            case ContributionType.CashReserve:
                currentState.assets.cash_reserve.balance_end += amount;
                break;
        }
        this.updateCurrentState(currentState);
    }

    contribute(contribution: number, contributionType: ContributionType): void {
        const currentState = this.getCurrentState();
        switch (contributionType) {
            case ContributionType.TaxDeferred:
                this.adjustContributionLimit(contribution, ContributionLimitType.Deferred);
                currentState.assets.tax_deferred.contribution += contribution;
                currentState.assets.tax_deferred.contribution_lifetime += contribution;
                break;
            case ContributionType.RothIra:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.assets.tax_exempt.contribution += contribution;
                currentState.assets.tax_exempt.contribution_lifetime += contribution;
                break;
            case ContributionType.Taxable:
                currentState.assets.taxable.contribution += contribution;
                currentState.assets.taxable.contribution_lifetime += contribution;
                break;
            case ContributionType.Elective:
                this.adjustContributionLimit(contribution, ContributionLimitType.Elective);
                currentState.assets.tax_deferred.contribution += contribution;
                currentState.assets.tax_deferred.contribution_lifetime += contribution;
                break;
            case ContributionType.Ira:
                this.adjustContributionLimit(contribution, ContributionLimitType.Ira);
                currentState.assets.tax_deferred.contribution += contribution;
                currentState.assets.tax_deferred.contribution_lifetime += contribution;
                break;
            case ContributionType.Hsa:
                this.adjustContributionLimit(contribution, ContributionLimitType.Hsa);
                currentState.assets.tax_deferred.contribution += contribution;
                currentState.assets.tax_deferred.contribution_lifetime += contribution;
                break;
            case ContributionType.CashReserve:
                currentState.assets.cash_reserve.contribution += contribution;
                currentState.assets.cash_reserve.contribution_lifetime += contribution;
                break;
        }
        this.updateCurrentState(currentState);
    }

    withdraw(amount: number, fundType: FundType, minimum?: number): void {
        const currentState = this.getCurrentState();
        switch (fundType) {
            case FundType.Taxable: {
                if (amount > currentState.cash.taxable) {
                    throw new Error('Insufficient taxable capital for withdrawal');
                }
                currentState.cash.taxable -= amount;
                currentState.income.taxable -= amount;
                const adjustedGrossIncome = this.getAGI(currentState)
                const newNetIncome = currentState.income.taxable - this.calculateTaxes(adjustedGrossIncome)
                currentState.income.net = newNetIncome
                currentState.cash.net = newNetIncome - currentState.cash.spent
                this.updateCurrentState(currentState)
                return
            }
            case FundType.Taxed: {
                if (amount > currentState.cash.net) {
                    throw new Error('Insufficient taxed capital for tax-exempt contribution');
                }
                const taxRate = currentState.cash.net / currentState.cash.taxable
                currentState.cash.net -= amount;
                currentState.cash.taxable = taxRate > 0 ? currentState.cash.net / taxRate : 0
                currentState.cash.spent += amount;
                this.updateCurrentState(currentState)
                return
            }
            default:
                throw new Error('Invalid fund type');
        }
    }

    getAGI(state: OrchestratorState): number {
        return state.income.taxable
    }

    calculateTaxes(agi: number): number {
        return agi * (this.config.tax_rate / 100)
    }

    canRetire(): boolean {
        const currentState = this.getCurrentState()
        switch (this.config.retirement_strategy) {
            case 'age':
                return currentState.plan.age === this.config.retirement_age;
            case 'debt_free':
                return this.getCurrentDebt() <= 0
            case 'percent_rule':
                return currentState.plan.retirement_income_goal <= currentState.plan.retirement_income_projected
            case 'target_savings': {
                const savingsEndOfYear = currentState.assets.tax_deferred.balance_end
                    + currentState.assets.tax_exempt.balance_end
                    + currentState.assets.taxable.balance_end
                    + currentState.cash.net
                return this.config.retirement_savings_amount <= savingsEndOfYear
            }
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
        const state = this.getCurrentState()
        const savingsEndOfYear = state.assets.tax_deferred.balance_end
            + state.assets.tax_exempt.balance_end
            + state.assets.taxable.balance_end
            + state.cash.net
        const projectedIncome = savingsEndOfYear * (this.config.retirement_withdrawal_rate / 100)
        this.updateCurrentState({
            ...state,
            plan: {
                ...state.plan,
                retirement_income_projected: projectedIncome,
            },
            income: {
                ...state.income,
                gross_lifetime: state.income.gross_lifetime + state.income.gross,
                taxable_lifetime: state.income.taxable_lifetime + state.income.taxable,
                net_lifetime: state.income.net_lifetime + state.income.net,
                agi_lifetime: state.income.agi_lifetime + state.income.agi,
            },
        })
    }

    simulate(commandSequence?: CommandSequenceWithRelations, maxIterations: number = 60): OrchestratorState[] {
        this.reset()
        const commands: Command[] = commandSequence ? commandSequence.command_sequence_commands.map(commandSequenceCommand => commandSequenceCommand.command) : []
        maxIterations = Math.min(maxIterations, this.config.life_expectancy - this.config.age + 1)
        for (let i = 0; i < maxIterations; i++) {
            let manager: BaseManager<any, any> | undefined = undefined
            if (commands) {
                commands.forEach(command => {
                    if (command.is_active) {
                        manager = this.getManagerById(command.model_name, Number(command.model_id))
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

    getManagerById<T extends BaseManager<any, any>>(managerName: ModelName, id: number): T {
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
                return currentState.limits.ira
            case ContributionLimitType.Elective:
                return currentState.limits.elective
            case ContributionLimitType.Deferred:
                return currentState.limits.deferred
            case ContributionLimitType.Hsa:
                return currentState.limits.hsa
        }
    }
}