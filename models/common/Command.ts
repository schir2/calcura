import type {ManagerMap} from "~/models/plan/PlanManager";

export default interface Command {
    name: string;
    label: string;
    managerName: keyof ManagerMap;
    managerId: string;
    action: 'process'
}
