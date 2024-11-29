import ManagerBase from "~/models/common/ManagerBase";
import type CashConfig from "~/models/cash/CashConfig";
import type PlanState from "~/models/plan/PlanState";
import type CashState from "~/models/cash/CashState";
import type Command from "~/models/common/Command";

export default class CashManager extends ManagerBase<CashConfig, CashState> {
    protected createInitialState(): CashState {
        return {
            cashStartOfYear: this.config.initialAmount,
            cashEndOfYear: undefined
        }
    }

    protected createNextState(previousState: CashState): CashState {
        assertDefined(previousState.cashEndOfYear, 'cashEndOfYear')
        return {
            cashStartOfYear: previousState.cashEndOfYear,
            cashEndOfYear: undefined
        }
    }

    getCommands(): Command[] {
        return [];
    }

    process(planState: PlanState): PlanState {
        return planState;
    }

}