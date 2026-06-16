import type {Plan} from "~/types/Plan";

export type PlanTemplate = Plan & {
    description: string;
}
