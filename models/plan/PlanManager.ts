import PlanConfig from "~/models/plan/PlanConfig";
import type PlanState from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import ManagerBase from "~/models/common/ManagerBase";
import {getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
import type Command from "~/models/common/Command";

export default class PlanManager extends ManagerBase<PlanConfig, PlanState> {
    debtManagers: DebtManager[]

    constructor(config: PlanConfig) {
        super(config)
        this.debtManagers = config.debts.map((debtConfig) => new DebtManager(debtConfig))

    }

    protected createInitialState(): PlanState {
        const grossIncome = this.config.incomes.reduce((accruedValue, income) => accruedValue + income.grossIncome, 0)
        return {
            age: this.config.age,
            year: this.config.year,
            grossIncome: grossIncome,
            disposableIncome: getDisposableIncome(grossIncome),
            electiveLimit: getTaxDeferredElectiveContributionLimit(this.config.year, this.config.age),
            deferredLimit: getTaxDeferredContributionLimit(this.config.year, this.config.age),
            iraLimit: getIraLimit(this.config.year, this.config.age),
            inflationRate: this.config.inflationRate,
            savingsStartOfYear: 0,
            savingsEndOfYear: 0,
            allowNegativeDisposableIncome: this.config.allowNegativeDisposableIncome
        }
    }

    protected createNextState(previousState: PlanState): PlanState {
        const age = previousState.year + 1
        const year = previousState.year + 1
        return {
            ...previousState,
            age: age,
            year: year,
            grossIncome: 0,
            disposableIncome: 0,
            electiveLimit: getTaxDeferredElectiveContributionLimit(year, age),
            deferredLimit: getTaxDeferredContributionLimit(year, age),
            iraLimit: getIraLimit(year, age),
            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear:0,
        }
    }

    getCommands(): Command[] {
        const commands: Command[] = []
        this.debtManagers.forEach((debtManager => commands.push(...debtManager.getCommands())))
        return commands;
    }

    process(planState: PlanState): PlanState {
        return planState
    }
}