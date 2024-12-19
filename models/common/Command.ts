import type {PlanState} from "~/models/plan/PlanState";

export default interface Command {
    execute(): void;
    getName(): string;
}
