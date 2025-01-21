export default interface ExpenseState {
    baseAmount: number;
    amountRequested: number;
    amountPaid: number;
    shortfall: number;
    growthAmount: number;
    processed: boolean;
}