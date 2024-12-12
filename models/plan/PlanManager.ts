import type {Plan} from "~/models/plan/Plan";
import type {PlanState} from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import ManagerBase from "~/models/common/ManagerBase";
import {getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
import type Command from "~/models/common/Command";
import IncomeManager from "~/models/income/IncomeManager";
import type {IncomeType} from "~/models/income/Income";
import BrokerageInvestmentManager from "~/models/brokerageInvestment/BrokerageInvestmentManager";
import ExpenseManager from "~/models/expense/ExpenseManager";
import IraInvestmentManager from "~/models/iraInvestment/IraInvestmentManager";
import CashReserveManager from "~/models/cashReserve/CashReserveManager";
import TaxDeferredInvestmentManager from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";

export default class PlanManager extends ManagerBase<Plan, PlanState> {
    managers: {
        incomeManagers: IncomeManager[]
        cashReserveManagers: CashReserveManager[]
        expenseManagers: ExpenseManager[]
        debtManagers: DebtManager[]
        brokerageInvestmentManagers: BrokerageInvestmentManager[]
        iraInvestmentManagers: IraInvestmentManager[]
        taxDeferredManagers: TaxDeferredInvestmentManager[]
    }

    constructor(config: Plan) {
        super(config)
        this.managers = {
            incomeManagers: config.incomes.map((income) => new IncomeManager(income)),
            cashReserveManagers: config.cashReserves.map((cashReserve) => new CashReserveManager(cashReserve)),
            expenseManagers: config.expenses.map((expense) => new ExpenseManager(expense)),
            debtManagers: config.debts.map((debt) => new DebtManager(debt)),
            brokerageInvestmentManagers: config.brokerageInvestments.map((brokerageInvestment) => new BrokerageInvestmentManager(brokerageInvestment)),
            iraInvestmentManagers: config.iraInvestments.map((iraInvestment) => new IraInvestmentManager(iraInvestment)),
            taxDeferredManagers: config.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestmentManager(taxDeferredInvestment))
        }
    }

    protected createInitialState(): PlanState {
        const grossIncome = this.config.incomes.reduce((agg, income) => agg + income.grossIncome, 0);
        return {
            age: this.config.age,
            year: this.config.year,
            grossIncome: grossIncome,
            taxableIncome: grossIncome,
            taxedIncome: 0,
            electiveLimit: getTaxDeferredElectiveContributionLimit(this.config.year, this.config.age),
            deferredLimit: getTaxDeferredContributionLimit(this.config.year, this.config.age),
            iraLimit: getIraLimit(this.config.year, this.config.age),
            inflationRate: this.config.inflationRate,
            savingsStartOfYear: 0,
            savingsEndOfYear: 0,
            allowNegativeDisposableIncome: this.config.allowNegativeDisposableIncome,
            processed: false,
            retirementIncomeProjected: 0,
            retired: false,
            growthApplicationStrategy: this.config.growthApplicationStrategy
        }
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
        return this.managers.incomeManagers.reduce((grossIncome, incomeManager) => incomeManager.getCurrentState().grossIncome, 0)
    }

    protected createNextState(previousState: PlanState): PlanState {
        const age = previousState.age + 1
        const year = previousState.year + 1
        return {
            ...previousState,
            age: age,
            year: year,
            grossIncome: this.getGrossIncome(),
            taxedIncome: 0,
            electiveLimit: getTaxDeferredElectiveContributionLimit(year, age),
            deferredLimit: getTaxDeferredContributionLimit(year, age),
            iraLimit: getIraLimit(year, age),
            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear: 0,
        }
    }

    getAllManagers(): ManagerBase<any, any>[] {
        const managerValues = Object.values(this.managers);
        const allManagers: ManagerBase<any, any>[] = [];

        managerValues.forEach((managerOrManagers) => {
            if (Array.isArray(managerOrManagers)) {
                allManagers.push(...managerOrManagers);
            } else {
                allManagers.push(managerOrManagers as ManagerBase<any, any>);
            }
        });

        return allManagers;
    }

    getCommands(): Command[] {
        const commands: Command[] = []
        this.getAllManagers().forEach(manager => commands.push(...manager.getCommands()))
        return commands;
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

    processUnprocessed(manager: ManagerBase<any, any>): PlanState {
        let planState = this.getCurrentState()
        const managerState = manager.getCurrentState()
        if (!managerState.processed) {
            planState = manager.process(planState)
        }
        return planState
    }

    getIncomeSummary(stateIndex?: number): Record<IncomeType, number> {
        let incomeTypes: Record<IncomeType, number> = {
            ordinary: 0
        }
        this.managers.incomeManagers.forEach((incomeManager) => {
            const incomeState = incomeManager.getState(stateIndex ?? 0)
            incomeTypes[incomeManager.getConfig().incomeType] = incomeState.grossIncome
        })
        return incomeTypes
    }
}