export default interface ExpenseState {
    baseAmount: number;
    amountRequested: number;
    amountPaid: number;
    growthAmount: number;
    processed: boolean;
}