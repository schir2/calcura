import type {PlanConfig} from "~/models/plan/PlanConfig";
import type PlanState from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import ManagerBase from "~/models/common/ManagerBase";
import {getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
import type Command from "~/models/common/Command";
import IncomeManager from "~/models/income/IncomeManager";
import TaxManager from "~/models/tax/TaxManager";
import RetirementManager from "~/models/retirement/RetirementManager";
import type {IncomeType} from "~/models/income/IncomeConfig";
import BrokerageInvestmentManager from "~/models/brokerage/BrokerageInvestmentManager";
import ExpenseManager from "~/models/expense/ExpenseManager";

export default class PlanManager extends ManagerBase<PlanConfig, PlanState> {
    managers: {
        retirementManager: RetirementManager
        taxManager: TaxManager
        debtManagers: DebtManager[]
        incomeManagers: IncomeManager[]
        brokerageInvestmentManagers: BrokerageInvestmentManager[]
        expenseManagers: ExpenseManager[]
    }

    constructor(config: PlanConfig) {
        super(config)
        this.managers = {
            retirementManager: new RetirementManager(config.retirement),
            taxManager: new TaxManager(config.tax),
            debtManagers: config.debts.map((debtConfig) => new DebtManager(debtConfig)),
            incomeManagers: config.incomes.map((incomeConfig) => new IncomeManager(incomeConfig)),
            brokerageInvestmentManagers: config.brokerageInvestments.map((brokerageInvestmentConfig) => new BrokerageInvestmentManager(brokerageInvestmentConfig)),
            expenseManagers: config.expenses.map((expenseConfig) => new ExpenseManager(expenseConfig)),
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
        }
    }

    getGrossIncome() {
        this.managers.incomeManagers.forEach((income) => {
            console.log(JSON.stringify(income.getConfig().name));
        });
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
            if (this.managers.retirementManager.retirementAchieved()) {
                return this.states
            }
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