export default interface DebtState {
    payment: number;
    paymentLifetime: number;
    interestLifetime: number;
    principalStartOfYear: number;
    interestAmount?: number;
    principalEndOfYear?: number;
    processed: boolean,
}