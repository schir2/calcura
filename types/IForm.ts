import type {
    ExpensesGrowthStrategy,
    GrowthStrategy,
    IncomeTaxStrategy,
    InflationGrowthStrategy,
    InvestmentGrowthApplicationStrategy,
    IraContributionStrategy,
    RetirementStrategy,
    TaxableContributionStrategy,
} from "~/types";
import type {DebtData} from "~/interfaces/DebtData";
import type {TaxDeferredContributionStrategy} from "~/constants/taxDeferred";
import type {EmployerContributionStrategy} from "~/constants/employerContribution";

export default interface IForm {
    /* Profile */
    age: number;
    year: number;
    lifeExpectancy: number;

    /* Extra Settings */
    allowNegativeDisposableIncome: 'none' | 'minimum_only' | 'full';
    investmentGrowthStrategy: InvestmentGrowthApplicationStrategy

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
    taxDeferredContributionStrategy: TaxDeferredContributionStrategy;
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
