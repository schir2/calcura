import type {RetirementStrategy} from "~/types";

export default interface RetirementConfig {
    id?: number;
    name: string;
    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

}