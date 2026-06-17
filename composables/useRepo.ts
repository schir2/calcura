export function useRepo() {
    const plan = useApi('plan')
    const brokerage = useApi('brokerage')
    const debt = useApi('debt')
    const income = useApi('income')
    const expense = useApi('expense')
    const cashReserve = useApi('cash_reserve')
    const ira = useApi('ira')
    const rothIra = useApi('roth_ira')
    const taxDeferred = useApi('tax_deferred')
    const commandSequence = useApi('command_sequence')

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