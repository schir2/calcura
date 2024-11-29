import type PlanConfig from "~/models/plan/PlanConfig";
import type PlanState from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";
import ManagerBase from "~/models/common/ManagerBase";
import {getIraLimit, getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionLimit} from "~/utils";
import type Command from "~/models/common/Command";
import IncomeManager from "~/models/income/IncomeManager";
import TaxManager from "~/models/tax/TaxManager";
import RetirementManager from "~/models/retirement/RetirementManager";
import type {IncomeType} from "~/models/income/IncomeConfig";

export default class PlanManager extends ManagerBase<PlanConfig, PlanState> {
    retirementManager: RetirementManager
    taxManager: TaxManager
    debtManagers: DebtManager[]
    incomeManagers: IncomeManager[]

    constructor(config: PlanConfig) {
        super(config)
        this.retirementManager = new RetirementManager(config.retirement)
        this.taxManager = new TaxManager(config.tax)
        this.debtManagers = config.debts.map((debtConfig) => new DebtManager(debtConfig))
        this.incomeManagers = config.incomes.map((incomeConfig) => new IncomeManager(incomeConfig))

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
            taxedIncome: 0,
            electiveLimit: getTaxDeferredElectiveContributionLimit(year, age),
            deferredLimit: getTaxDeferredContributionLimit(year, age),
            iraLimit: getIraLimit(year, age),
            savingsStartOfYear: previousState.savingsEndOfYear,
            savingsEndOfYear: 0,
        }
    }

    getCommands(): Command[] {
        const commands: Command[] = []
        this.debtManagers.forEach((debtManager => commands.push(...debtManager.getCommands())))
        this.incomeManagers.forEach((incomeManager) => commands.push(...incomeManager.getCommands()))
        return commands;
    }

    process(planState: PlanState): PlanState {
        return planState
    }

    simulate(): PlanState[] {
        while (true){
            const newState = this.process(this.getCurrentState())
            this.updateCurrentState(newState)
            if (this.retirementManager.retirementAchieved()){
                return this.states
            }
            this.advanceTimePeriod()
        }
    }

    getIncomeSummary(stateIndex?: number): Record<IncomeType, number>{
        let incomeTypes: Record<IncomeType, number> = {
            ordinary: 0
        }
        this.incomeManagers.forEach((incomeManager) =>{
            const incomeState = incomeManager.getState(stateIndex?? 0)
            incomeTypes[incomeManager.getConfig().incomeType] = incomeState.grossIncome
        })



        return incomeTypes
    }
}