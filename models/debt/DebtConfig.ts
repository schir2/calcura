import type {DebtPaymentStrategy} from "~/types";
import {DEBT_TEMPLATE} from "~/models/debt/constants";

export interface DebtData {
    name: string;
    principal: number;
    interestRate: number;
    paymentMinimum: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
}

export default class DebtConfig {
    name: string;
    principalStartOfYear: number;
    principalEndOfYear: number;
    interestRate: number;
    interestAmount: number;
    payment: number;
    paymentFixedAmount: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentLifetime: number;
    paymentMinimum: number;
    paymentPercentage: number;
    interestAccrued: number;

    constructor(data: DebtData) {
        this.name = data.name;

        this.interestRate = data.interestRate;
        this.interestAmount = 0
        this.interestAccrued = 0;

        this.payment = 0;
        this.paymentLifetime = 0;
        this.paymentMinimum = data.paymentMinimum;
        this.paymentStrategy = data.paymentStrategy;
        this.paymentFixedAmount = data.paymentFixedAmount;
        this.paymentPercentage = data.paymentPercentage;

        this.principalStartOfYear = data.principal;
        this.principalEndOfYear = data.principal;
    }

    calculateEndOfYearValues() {
        const principalEndOfYear = this.principalStartOfYear - this.payment;
        const interestAmount = principalEndOfYear * (this.interestRate / 100);
        const interestAccrued = this.interestAccrued + interestAmount;
        const paymentLifetime = this.paymentLifetime + this.payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;
        return {
            principalEndOfYear: updatedPrincipalEndOfYear,
            interestAmount,
            interestAccrued,
            paymentLifetime,
        };
    }


    calculatePayment(disposableIncome: number) {
        let payment = 0
        switch (this.paymentStrategy) {
            case 'fixed':
                payment = this.paymentFixedAmount;
                break
            case 'percentage_of_debt':
                payment = this.principalStartOfYear * (this.paymentFixedAmount / 100);
                break
            case 'max':
                payment = this.principalStartOfYear;
                break
        }
        payment = Math.max(payment, this.paymentMinimum);
        return Math.min(payment, disposableIncome, this.principalStartOfYear);

    }

    advanceToNextYear(): DebtConfig {
        let debt = structuredClone(this)
        debt.principalStartOfYear = this.principalEndOfYear
        debt.payment = 0
        return debt
    }

    static defaultValues(template?: keyof typeof DEBT_TEMPLATE){
        return DEBT_TEMPLATE[template ?? 'default']
    }
}
