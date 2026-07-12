import type {PlanWithRelations} from "#shared/types/Plan";
import {ContributionLimitType} from "#shared/types/Plan";
import type {OrchestratorState} from "#shared/types/OrchestratorState";
import DebtManager from "~/models/debt/DebtManager";
import BaseManager from "~/models/common/BaseManager";
import {
    getHsaLimit,
    getIraLimit,
    getTaxDeferredContributionLimit,
    getTaxDeferredElectiveContributionLimit
} from "~/utils";
import {IncomeManager} from "~/models/income/IncomeManager";
import {BrokerageManager} from "~/models/brokerage/BrokerageManager";
import {ExpenseManager} from "~/models/expense/ExpenseManager";
import {IraManager} from "~/models/ira/IraManager";
import {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
import {BaseOrchestrator} from "~/models/common/BaseOrchestrator";
import {ContributionError} from "~/utils/errors/ContributionError";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import eventBus from "~/utils/eventBus";
import {ContributionType} from "#shared/types/ContributionType";
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {ModelName} from "#shared/types/ModelName";
import {predefinedOrderRank} from "~/constants/CommandOrder";
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
    ira: IraManager[];
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
            ira: this.config.iras.map((ira) => new IraManager(this, ira)),
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

    getCashReserveInitial(): number {
        return this.config.cash_reserves.reduce((total, cashReserve) => total + cashReserve.initial_amount, 0)
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
        const cashReserveInitial = this.getCashReserveInitial()
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
                    balance_start: cashReserveInitial,
                    balance_end: cashReserveInitial,
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

    requestFunds(requestedAmount: number, fundType: FundType): number {
        const currentState = this.getCurrentState()
        let availableFunds = 0
        switch (fundType) {
            case FundType.Taxable:
                availableFunds = currentState.cash.taxable
                break
            case FundType.Taxed:
                availableFunds = currentState.cash.net
                break
            default:
                throw new Error(`Unsupported fund type: ${fundType}`);
        }
        return Math.max(Math.min(availableFunds, requestedAmount), 0)
    }

    requestAndWithdraw(requestedAmount: number, fundType: FundType): number {
        const amount = this.requestFunds(requestedAmount, fundType)
        this.withdraw(amount, fundType)
        return amount
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

    payDebt(amount: number) {
        this.withdraw(amount, FundType.Taxed)
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

    withdraw(amount: number, fundType: FundType): void {
        if (amount <= 0) return
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

    isRetired(): boolean {
        return this.states.length > 0 && this.getCurrentState().retired
    }

    getGrossIncome() {
        if (this.isRetired()) {
            return 0
        }
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

    private liquidateFromManager(manager: BaseManager<any, any>, amount: number): number {
        const states = manager.getStates()
        const upcoming = states[states.length - 1] as { balance_start_of_year?: number }
        const justProcessed = states[states.length - 2] as { balance_end_of_year?: number } | undefined
        const available = upcoming?.balance_start_of_year ?? 0
        const taken = Math.min(available, Math.max(0, amount))
        if (upcoming) upcoming.balance_start_of_year = available - taken
        if (justProcessed && justProcessed.balance_end_of_year !== undefined) {
            justProcessed.balance_end_of_year -= taken
        }
        return taken
    }

    withdrawFromSavings(amountNeeded: number): number {
        let remaining = Math.max(0, amountNeeded)
        let raised = 0
        const tiers: { bucket: 'taxable' | 'tax_deferred' | 'tax_exempt', managers: BaseManager<any, any>[] }[] = [
            {bucket: 'taxable', managers: this._managers.brokerage},
            {bucket: 'tax_deferred', managers: [...this._managers.tax_deferred, ...this._managers.ira, ...this._managers.hsa]},
            {bucket: 'tax_exempt', managers: this._managers.roth_ira},
        ]
        for (const tier of tiers) {
            if (remaining <= 0) break
            const state = this.getCurrentState()
            const available = state.assets[tier.bucket].balance_end
            const take = Math.min(available, remaining)
            if (take <= 0) continue
            state.assets[tier.bucket].balance_end = available - take
            this.updateCurrentState(state)
            let toReduce = take
            for (const manager of tier.managers) {
                if (toReduce <= 0) break
                toReduce -= this.liquidateFromManager(manager, toReduce)
            }
            remaining -= take
            raised += take
        }
        return raised
    }

    private drawDownForRetirement(): void {
        const shortfall = this.getCurrentState().liabilities.expense.shortfall
        if (shortfall <= 0) return
        const raised = this.withdrawFromSavings(shortfall)
        if (raised <= 0) return
        const state = this.getCurrentState()
        this.updateCurrentState({
            ...state,
            liabilities: {
                ...state.liabilities,
                expense: {
                    ...state.liabilities.expense,
                    paid: state.liabilities.expense.paid + raised,
                    shortfall: state.liabilities.expense.shortfall - raised,
                    balance_end: state.liabilities.expense.shortfall - raised,
                    paid_lifetime: state.liabilities.expense.paid_lifetime + raised,
                    shortfall_lifetime: state.liabilities.expense.shortfall_lifetime - raised,
                },
            },
        })
    }

    getDepletionAge(): number | null {
        for (const state of this.states) {
            if (state.retired && state.liabilities.expense.shortfall > 0.01) {
                return state.plan.age
            }
        }
        return null
    }

    simulate(commandSequence?: CommandSequenceWithRelations, maxIterations: number = 120): OrchestratorState[] {
        this.reset()
        const activeCommands: CommandSequenceCommandWithRelations[] = commandSequence
            ? [...commandSequence.command_sequence_commands]
                .sort((a, b) => commandSequence.ordering_type === 'predefined'
                    ? predefinedOrderRank(a.command.model_name) - predefinedOrderRank(b.command.model_name)
                    : a.order - b.order
                )
                .filter(csc => csc.is_active)
            : []
        maxIterations = Math.min(maxIterations, this.config.life_expectancy - this.config.age + 1)
        for (let i = 0; i < maxIterations; i++) {
            activeCommands.forEach(csc => {
                const manager = this.getManagerById(csc.command.model_name, Number(csc.command.model_id))
                manager?.process()
                manager?.advanceTimePeriod()
            })
            if (this.isRetired()) {
                this.drawDownForRetirement()
            }
            this.process()
            if (!this.getCurrentState().retired && this.canRetire()) {
                this.updateCurrentState({...this.getCurrentState(), retired: true})
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