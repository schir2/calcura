export default interface DebtState {
    payment: number;
    payment_lifetime: number;
    interest_lifetime: number;
    principal_start_of_year: number;
    interest_amount?: number;
    principal_end_of_year?: number;
    processed: boolean,
}