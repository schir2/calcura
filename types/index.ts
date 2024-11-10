export type RetirementStrategy = 'debt_free' | 'age' | 'percent_rule' | 'target_savings';
export type GrowthStrategy = 'fixed' | 'percentage_increase';
export type IncomeTaxStrategy = 'simple' | 'bracket';
export type ContributionStrategy = 'fixed' | 'percent_of_income' | 'until_company_match' | 'max';
export type EmployerContributionStrategy = 'none' | 'percentage_of_contribution' | 'percentage_of_compensation' | 'fixed';
export type InflationGrowthStrategy = 'fixed' | 'percentage_increase';
export type ExpensesGrowthStrategy = 'fixed' | 'percentage_increase';
export type IraContributionStrategy = 'fixed' | 'percent_of_income' | 'max';
export type InvestmentGrowthStrategy = 'start' | 'end';
export type TaxableContributionStrategy = 'fixed' | 'percent_of_income';
export type IraType = 'roth' | 'traditional'