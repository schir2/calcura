import type {PlanManagers} from "~/models/plan/PlanManager";

export interface Command {
    id: number;
    order: number;
    name: string;
    label: string;
    item_type: keyof PlanManagers;
    model_id: number;
    action: "process";
    is_active: boolean;
    item_id: number;
}