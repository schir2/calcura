export default interface ExpenseState {
    base_amount: number;
    amount_requested: number;
    amount_paid: number;
    shortfall: number;
    growth_amount: number;
    processed: boolean;
}