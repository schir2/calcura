import type {Plan} from "~/models/plan/Plan";

export interface PlanTemplate extends Plan{
    description: string;
}