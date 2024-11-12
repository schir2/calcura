import type {
    ContributionStrategy,
    EmployerContributionStrategy,
    ExpensesGrowthStrategy,
    GrowthStrategy,
    IncomeTaxStrategy,
    InflationGrowthStrategy,
    InvestmentGrowthStrategy,
    IraContributionStrategy,
    RetirementStrategy,
    TaxableContributionStrategy,
} from "~/types";
import type {DebtData} from "~/interfaces/DebtData";

export default interface FormData {
    /* Profile */
    age: number;
    year: number;
    lifeExpectancy: number;

    /* Extra Settings */
    allowNegativeDisposableIncome: 'none' | 'minimum_only' | 'full';
    investmentGrowthStrategy: InvestmentGrowthStrategy

    /* Retirement Strategies */
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

    cash: number;

    /* Income */
    incomePreTaxed: number;
    incomeGrowthStrategy: GrowthStrategy;
    incomeGrowthRate: number;

    /* Income Tax */
    incomeTaxRate: number;
    incomeTaxStrategy: IncomeTaxStrategy;
    incomeTaxFilingStatus: string;
    incomeTaxNumberOfDependents: string;

    /* Expenses */
    expenses: number;
    expenseRate: number;
    expensesGrowthStrategy: ExpensesGrowthStrategy;

    /* Debt */
    debts: DebtData[];

    /* Tax Deferred Savings */
    taxDeferredSavings: number;
    taxDeferredContributionFixedAmount: number;
    taxDeferredContributionStrategy: ContributionStrategy;
    taxDeferredContributionPercentage: number;
    taxDeferredGrowthRate: number;

    /* Employer Contributions */
    employerContributionStrategy: EmployerContributionStrategy;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;
    employerContributionPercentage: number;
    employerContributionFixedAmount: number;

    /* IRA Savings */
    iraTaxableSavings: number;
    iraTaxableContributionFixedAmount: number;
    iraTaxableContributionStrategy: IraContributionStrategy;
    iraTaxableContributionPercentage: number;

    iraTaxDeferredSavings: number;
    iraTaxDeferredContributionFixedAmount: number;
    iraTaxDeferredContributionStrategy: IraContributionStrategy;
    iraTaxDeferredContributionPercentage: number;

    iraGrowthRate: number;

    /* Taxable Savings */
    taxableContributionFixedAmount: number;
    taxableContributionStrategy: TaxableContributionStrategy;
    taxableSavings: number;
    taxableContributionPercentage: number;
    taxableGrowthRate: number;

    /* Inflation */
    inflationRate: number;
    inflationGrowthStrategy: InflationGrowthStrategy;
}
