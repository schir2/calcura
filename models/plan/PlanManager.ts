import type PlanConfig from "~/models/plan/PlanConfig";
import type PlanState from "~/models/plan/PlanState";

export default class PlanManager {
    private config: PlanConfig
    planStates: PlanState[] = []

    constructor(config: PlanConfig) {
        this.config = config

    }
}