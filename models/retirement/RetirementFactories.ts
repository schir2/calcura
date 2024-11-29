import type RetirementConfig from "~/models/retirement/RetirementConfig";
import {DEFAULT_RETIREMENT_AGE, DEFAULT_RETIREMENT_LIFE_EXPECTANCY} from "~/models/retirement/RetirementConstants";

export function ageRetirementFactory(): RetirementConfig {
    return {
        name: 'Retire by a Certain Age',
        retirementStrategy: 'age',
        retirementAge: DEFAULT_RETIREMENT_AGE,
        lifeExpectancy: DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
        retirementSavingsAmount: 0,
        retirementWithdrawalRate: 0,
        retirementIncomeGoal: 0,
    }
}
