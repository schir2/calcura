import type Command from "~/models/common/Command";
import type TaxDeferredInvestmentManager from "~/models/taxDeferredInvestment/TaxDeferredInvestmentManager";

export class ProcessTaxDeferredInvestmentCommand implements Command {
    private taxDeferredInvestmentManager: TaxDeferredInvestmentManager;

    constructor(taxDeferredInvestmentManager: TaxDeferredInvestmentManager) {
        this.taxDeferredInvestmentManager = taxDeferredInvestmentManager;
    }

    execute(): void {
        return this.taxDeferredInvestmentManager.process();
    }

    getName(): string {
        return `Process TaxDeferredInvestment: ${this.taxDeferredInvestmentManager.getConfig().name}`;
    }
}
