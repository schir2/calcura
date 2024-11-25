import ManagerBase from "~/models/common/ManagerBase";
import type TaxState from "~/models/tax/TaxState";
import TaxConfig from "~/models/tax/TaxConfig";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {IncomeType} from "~/models/income/IncomeConfig";
import {DEFAULT_TAX_RATE} from "~/models/tax/TaxConstants";

export default class TaxManager extends ManagerBase<TaxConfig, TaxState> {
    protected createInitialState(): TaxState {
        return {};
    }

    protected createNextState(previousState: TaxState): TaxState {
        return {};
    }

    getCommands(): Command[] {
        return [];
    }

    process(planState: PlanState): PlanState {
        return planState;
    }

    getTaxedIncome(preTaxIncome: number, incomeType: IncomeType): number {
        switch (this.config.taxStrategy) {
            case "simple":
                switch (incomeType) {
                    default:
                        return preTaxIncome * (100 - DEFAULT_TAX_RATE) / 100
                }
            default:
                return preTaxIncome * (100 - DEFAULT_TAX_RATE) / 100
        }
    }


}