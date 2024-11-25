import {DEBT_TEMPLATE} from "~/models/debt/DebtConstants";

export type DebtPaymentStrategy = 'fixed' | 'max' | 'percentage_of_debt'

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
    principal: number;
    interestRate: number;
    paymentFixedAmount: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentMinimum: number;
    paymentPercentage: number;

    constructor(data: DebtData) {
        this.name = data.name;
        this.principal = data.principal;
        this.interestRate = data.interestRate;
        this.paymentMinimum = data.paymentMinimum;
        this.paymentStrategy = data.paymentStrategy;
        this.paymentFixedAmount = data.paymentFixedAmount;
        this.paymentPercentage = data.paymentPercentage;
    }

    static defaultValues(template?: keyof typeof DEBT_TEMPLATE) {
        return DEBT_TEMPLATE[template ?? 'default']
    }
}
