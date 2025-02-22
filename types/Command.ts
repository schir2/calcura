import type {PlanManagers} from "~/models/plan/PlanManager";

export interface Command {
    commandId: number;
    order: number;
    name: string;
    label: string;
    managerName: keyof PlanManagers;
    managerId: number;
    action: "process";
}