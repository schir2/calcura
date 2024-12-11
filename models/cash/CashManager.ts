import ManagerBase from "~/models/common/ManagerBase";
import type {Cash} from "~/models/cash/Cash";
import type {PlanState} from "~/models/plan/PlanState";
import type CashState from "~/models/cash/CashState";
import type Command from "~/models/common/Command";

export default class CashManager extends ManagerBase<Cash, CashState> {
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

    processImplementation(planState: PlanState): PlanState {
        return planState;
    }

}