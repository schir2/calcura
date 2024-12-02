export default interface ExpenseState {
    payment: number;
    isPaid: boolean;
    isActive?: boolean;
    processed: boolean;
}