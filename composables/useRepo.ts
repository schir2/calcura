import type {Brokerage} from "~/types/Brokerage";
import type {Debt} from "~/types/Debt";
import type {RothIra} from "~/types/RothIra";
import type {TaxDeferred} from "~/types/TaxDeferred";
import type {Ira} from "~/types/Ira";
import type {Expense} from "~/types/Expense";
import type {Income} from "~/types/Income";
import type {CashReserve} from "~/types/CashReserve";
import type {CommandSequence} from "~/types/CommandSequence";
import type {Plan} from "~/types/Plan";

export function useRepo() {
    const plan= useApi<Plan>('plans')
    const brokerage = useApi<Brokerage>('brokerages')
    const debt = useApi<Debt>('debts')
    const income = useApi<Income>('incomes')
    const expense = useApi<Expense>('expenses')
    const cashReserve = useApi<CashReserve>('cash-reserves')
    const ira = useApi<Ira>('iras')
    const rothIra = useApi<RothIra>('roth-iras')
    const taxDeferred = useApi<TaxDeferred>('tax-deferreds')
    const commandSequence = useApi<CommandSequence>('command-sequences')

    return {
        plan,
        brokerage,
        debt,
        income,
        expense,
        cashReserve,
        ira,
        rothIra,
        taxDeferred,
        commandSequence,
    }
}