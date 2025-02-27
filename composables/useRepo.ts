import type {BrokerageInvestment} from "~/types/BrokerageInvestment";
import type {Debt} from "~/types/Debt";
import type {RothIraInvestment} from "~/types/RothIraInvestment";
import type {TaxDeferredInvestment} from "~/types/TaxDeferredInvestment";
import type {IraInvestment} from "~/types/IraInvestment";
import type {Expense} from "~/types/Expense";
import type {Income} from "~/types/Income";
import type {CashReserve} from "~/types/CashReserve";
import type {CommandSequence} from "~/types/CommandSequence";

export function useRepo() {
    const brokerageInvestment = useApi<BrokerageInvestment>('brokerage-investments')
    const debt = useApi<Debt>('debts')
    const income = useApi<Income>('incomes')
    const expense = useApi<Expense>('expenses')
    const cashReserve = useApi<CashReserve>('cash-reserves')
    const iraInvestment = useApi<IraInvestment>('ira-investments')
    const rothIraInvestment = useApi<RothIraInvestment>('roth-ira-investments')
    const taxDeferredInvestment = useApi<TaxDeferredInvestment>('tax-deferred-investments')
    const commandSequence = useApi<CommandSequence>('command-sequences')

    return {
        brokerageInvestment,
        debt,
        income,
        expense,
        cashReserve,
        iraInvestment,
        rothIraInvestment,
        taxDeferredInvestment,
        commandSequence,
    }
}