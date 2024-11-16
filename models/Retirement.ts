import type {RetirementStrategy} from "~/types";

export interface RetirementData {
    age: number;
    year: number;
    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

}