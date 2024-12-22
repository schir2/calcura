import type Command from "~/models/common/Command";
import type IraInvestmentManager from "~/models/iraInvestment/IraInvestmentManager";

export class ProcessIraInvestmentCommand implements Command {
    private taxDeferredInvestmentManager: IraInvestmentManager;

    constructor(taxDeferredInvestmentManager: IraInvestmentManager) {
        this.taxDeferredInvestmentManager = taxDeferredInvestmentManager;
    }

    execute(): void {
        return this.taxDeferredInvestmentManager.process();
    }

    getName(): string {
        return `Process IraInvestment: ${this.taxDeferredInvestmentManager.getConfig().name}`;
    }
}
