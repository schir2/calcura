import type Command from "~/models/common/Command";
import DebtManager from "~/models/debt/DebtManager";

export class ProcessDebtCommand implements Command {
    private debtManager: DebtManager;

    constructor(debtManager: DebtManager) {
        this.debtManager = debtManager;
    }

    execute(): void {
        return this.debtManager.process();
    }

    getName(): string {
        return `Process Debt: ${this.debtManager.getConfig().name}`;
    }
}
