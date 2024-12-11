import type Command from "~/models/common/Command";
import DebtManager from "~/models/debt/DebtManager";
import type {PlanState} from "~/models/plan/PlanState";

export class ProcessDebtCommand implements Command {
    private debtManager: DebtManager;

    constructor(debtManager: DebtManager) {
        this.debtManager = debtManager;
    }

    execute(planState: PlanState): PlanState {
        return this.debtManager.process(planState);
    }

    getName(): string {
        return `Process Debt: ${this.debtManager.getConfig().name}`;
    }
}
