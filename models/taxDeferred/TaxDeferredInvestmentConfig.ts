import type {InvestmentGrowthApplicationStrategy} from "~/types";
import type {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";


export default interface TaxDeferredInvestmentConfig {
    id?: number;
    name: string;

    growthApplicationStrategy: InvestmentGrowthApplicationStrategy
    growthRate: number;
    initialBalance: number;

    electiveContributionStrategy: TaxDeferredContributionStrategy;
    electiveContributionPercentage: number;
    electiveContributionFixedAmount: number;

    employerContributes: boolean;
    employerContributionStrategy: EmployerContributionStrategy;
    employerCompensationMatchPercentage: number;
    employerContributionFixedAmount: number;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;

}