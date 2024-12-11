import {IRA_CATCH_UP_AGE, IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024, IRA_CONTRIBUTION_LIMIT_2024} from "~/models/iraInvestment/IraInvestmentConstants";


export function getIraContributionLimit(year: number, age: number): number {
    return IRA_CONTRIBUTION_LIMIT_2024 + age >= IRA_CATCH_UP_AGE ? IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024 : 0

}