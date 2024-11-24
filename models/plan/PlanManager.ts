import type PlanConfig from "~/models/plan/PlanConfig";
import type PlanState from "~/models/plan/PlanState";
import DebtManager from "~/models/debt/DebtManager";

export default class PlanManager {
    private config: PlanConfig
    planStates: PlanState[] = []
    debtManagers: DebtManager[]

    constructor(config: PlanConfig) {
        this.config = config
        this.debtManagers = config.debts.map((debtConfig)=>new DebtManager(debtConfig));

    }
}