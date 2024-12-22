import type Command from "~/models/common/Command";
import type BrokerageInvestmentManager from "~/models/brokerageInvestment/BrokerageInvestmentManager";

export class ProcessBrokerageInvestmentCommand implements Command {
    private brokerageInvestmentManager: BrokerageInvestmentManager;

    constructor(brokerageInvestmentManager: BrokerageInvestmentManager) {
        this.brokerageInvestmentManager = brokerageInvestmentManager;
    }

    execute(): void {
        return this.brokerageInvestmentManager.process();
    }

    getName(): string {
        return `Process BrokerageInvestment: ${this.brokerageInvestmentManager.getConfig().name}`;
    }
}
