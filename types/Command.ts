import type {PlanManagers} from "~/models/plan/PlanManager";

export interface Command {
    commandId: number;
    order: number;
    name: string;
    label: string;
    modelName: keyof PlanManagers;
    modelId: number;
    action: "process";
}