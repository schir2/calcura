import {ExpenseManager} from "~/models/expense/ExpenseManager";
import {CashReserveManager} from "~/models/cashReserve/CashReserveManager";
import DebtManager from "~/models/debt/DebtManager";
import {IncomeManager} from "~/models/income/IncomeManager";
import {TaxDeferredManager} from "~/models/taxDeferred/TaxDeferredManager";
import {RothIraManager} from "~/models/rothIra/RothIraManager";
import {IraIManager} from "~/models/ira/IraIManager";
import {BrokerageManager} from "~/models/brokerage/BrokerageManager";

export const orchestratorStore = defineStore('orchestrator', () => {
    const plan = ref<null | Plan>(null)

})