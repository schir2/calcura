import type FormData from '~/types/FormData'
const initialFormData: FormData = {
    age: 38,
    year: 2024,
    lifeExpectancy: 75,
    retirementStrategy: 'age',
    retirementWithdrawalRate: 4,
    retirementIncomeGoal: 100000,
    retirementAge: 40,
    retirementSavingsAmount: 2000000,
    cash: 27000,
    incomePreTaxed: 200000,
    incomeGrowthStrategy: 'percentage_increase',
    incomeGrowthRate: 0,
    incomeTaxRate: 30.0,
    incomeTaxStrategy: 'simple',
    incomeTaxFilingStatus: 'single',
    incomeTaxNumberOfDependents: '0',
    investmentGrowthStrategy: 'start',
    expenses: 50000,
    expenseRate: 2,
    expensesGrowthStrategy: 'fixed',

    debts: [],

    taxDeferredSavings: 0,
    taxDeferredContributionFixedAmount: 5000,
    taxDeferredContributionStrategy: 'max',
    taxDeferredContributionPercentage: 6,
    taxDeferredGrowthRate: 6.0,
    employerContributionStrategy: 'percentage_of_contribution',
    employerMatchPercentage: 100,
    employerMatchPercentageLimit: 3,
    employerContributionPercentage: 0,
    employerContributionFixedAmount: 0,

    iraTaxableSavings: 0,
    iraTaxableContributionFixedAmount: 0,
    iraTaxableContributionStrategy: 'max',
    iraTaxableContributionPercentage: 0,

    iraTaxDeferredSavings: 0,
    iraTaxDeferredContributionFixedAmount: 0,
    iraTaxDeferredContributionStrategy: 'max',
    iraTaxDeferredContributionPercentage: 0,

    iraGrowthRate: 6.0,

    taxableContributionFixedAmount: 10,
    taxableContributionStrategy: 'fixed',
    taxableSavings: 0,
    taxableContributionPercentage: 0,
    taxableGrowthRate: 10.0,
    inflationRate: 2.0,
    inflationGrowthStrategy: 'fixed',
    allowNegativeBalance: false,
};

export default initialFormData;
