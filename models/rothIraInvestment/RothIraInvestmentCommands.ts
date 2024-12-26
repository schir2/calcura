import type Command from "~/models/common/Command";
import type {RothIraInvestmentManager} from "~/models/rothIraInvestment/RothIraInvestmentManager";

export class ProcessRothIraInvestmentCommand implements Command {
    private taxDeferredInvestmentManager: RothIraInvestmentManager;

    constructor(taxDeferredInvestmentManager: RothIraInvestmentManager) {
        this.taxDeferredInvestmentManager = taxDeferredInvestmentManager;
    }

    execute(): void {
        return this.taxDeferredInvestmentManager.process();
    }

    getName(): string {
        return `Process RothIraInvestment: ${this.taxDeferredInvestmentManager.getConfig().name}`;
    }
}
