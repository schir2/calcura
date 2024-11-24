import ManagerBase from "~/models/common/ManagerBase";
import ExpensePlanConfig from "~/models/expense/ExpensePlanConfig";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";

export interface ExpensePlanState {

}

export default class ExpensePlanManager extends ManagerBase<ExpensePlanConfig, ExpensePlanState> {
    protected createInitialState(): ExpensePlanState {
        return undefined;
    }

    protected createNextState(previousState: ExpensePlanState): ExpensePlanState {
        return undefined;
    }

    getCommands(): Command[] {
        return [];
    }

    process(planState: PlanState): PlanState {
        return undefined;
    }

}