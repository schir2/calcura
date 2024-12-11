import type {PlanState} from "~/models/plan/PlanState";

export default interface Command {
    execute(planState: PlanState): PlanState;
    getName(): string;
}
