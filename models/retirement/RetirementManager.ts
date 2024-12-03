import ManagerBase from "~/models/common/ManagerBase";
import  type RetirementConfig from "~/models/retirement/RetirementConfig";
import type RetirementState from "~/models/retirement/RetirementState";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";

export default class RetirementManager extends ManagerBase<RetirementConfig, RetirementState>{
    protected createInitialState(): RetirementState {
        return {
            retired: false,
            retirementIncomeProjected: 0,
            processed: false,
        };
    }

    protected createNextState(previousState: RetirementState): RetirementState {
        return previousState;
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(planState: PlanState): PlanState {
        return planState;
    }

    retirementAchieved(): boolean{
        return this.getCurrentState().retired;
    }

}