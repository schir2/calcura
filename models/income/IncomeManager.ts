import BaseManager from "~/models/common/BaseManager";
import type IncomeState from "~/models/income/IncomeState";
import type {Income} from "~/models/income/Income";
import type Command from "~/models/common/Command";

export class IncomeManager extends BaseManager<Income, IncomeState> {
    protected createInitialState(): IncomeState {
        return {
            grossIncome: this.config.grossIncome,
            processed: false,
        }
    }

    createNextState(previousState: IncomeState): IncomeState {
        return {
            grossIncome: previousState.grossIncome + this.getGrowthAmount(previousState.grossIncome),
            processed: false,
        }
    }

    protected getGrowthAmount(grossIncome: number): number {
        return grossIncome * this.config.growthRate / 100
    }

    override getCommands(): Command[] {
        return [{
            managerName: "incomeManagers",
            managerId: `${this.config.id}`,
            label: 'Income',
            name: this.config.name,
            action: 'process',
        }];
    }

    processImplementation(): void {
    }

}