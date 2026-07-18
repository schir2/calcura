export type DebtState = {
    payment: number;
    payment_lifetime: number;
    interest_lifetime: number;
    principal_start_of_year: number;
    interest_amount?: number;
    principal_end_of_year?: number;
    // The scheduled payment that cash could not cover this year — funded from savings in retirement.
    payment_shortfall: number;
    processed: boolean,
}