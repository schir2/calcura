import type {RetirementStrategy} from "~/types";
import {RETIREMENT_TEMPLATE} from "~/constants/retirement";

export interface RetirementData {
    name: string;
    age: number;
    year: number;
    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

}

export default class Retirement {
    name: string;
    age: number;
    year: number;
    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

    constructor(data: RetirementData) {
        this.name = data.name;
        this.age = data.age;
        this.year = data.year;
        this.lifeExpectancy = data.lifeExpectancy;
        this.retirementStrategy = data.retirementStrategy;
        this.retirementWithdrawalRate = data.retirementWithdrawalRate;
        this.retirementIncomeGoal = data.retirementIncomeGoal;
        this.retirementAge = data.retirementAge;
        this.retirementSavingsAmount = data.retirementSavingsAmount;
    }

    static defaultValues(template?: keyof typeof RETIREMENT_TEMPLATE): RetirementData {
        return RETIREMENT_TEMPLATE[template ?? 'default']
    }
}