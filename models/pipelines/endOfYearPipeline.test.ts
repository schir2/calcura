import {describe} from 'vitest';
import {faker} from '@faker-js/faker';
import Row from '~/models/Row';
import type IForm from '~/types/IForm';

describe('endOfYearPipeline Tests with Faker', () => {
    let row: Row;

    function generateMockFormData(): IForm {
        return {
            age: faker.number.int({min: 18, max: 70}),
            year: faker.date.future().getFullYear(),
            lifeExpectancy: faker.number.int({min: 75, max: 95}),
            cash: faker.number.float({min: 1000, max: 100000, fractionDigits: 2}),
            incomePreTaxed: faker.number.float({min: 30000, max: 200000, fractionDigits: 2}),
            incomeGrowthStrategy: faker.helpers.arrayElement(['fixed', 'percentage_increase']),
            incomeGrowthRate: faker.number.float({min: 0, max: 10, fractionDigits: 2}),
            incomeTaxRate: faker.number.float({min: 10, max: 35, fractionDigits: 2}),
            incomeTaxStrategy: faker.helpers.arrayElement(['simple', 'bracket']),
            incomeTaxFilingStatus: faker.helpers.arrayElement(['single', 'married']),
            incomeTaxNumberOfDependents: faker.number.int({min: 0, max: 5}).toString(),
            expenses: faker.number.float({min: 10000, max: 80000, fractionDigits: 2}),
            expenseRate: faker.number.float({min: 1, max: 5, fractionDigits: 2}),
            expensesGrowthStrategy: faker.helpers.arrayElement(['fixed', 'percentage_increase']),
            debts: [
                {
                    debtName: 'Car Loan',
                    principal: faker.number.float({min: 5000, max: 30000, fractionDigits: 2}),
                    interestRate: faker.number.float({min: 1, max: 10, fractionDigits: 2}),
                    minimumPayment: faker.number.float({min: 100, max: 1000, fractionDigits: 2}),
                    paymentStrategy: faker.helpers.arrayElement(['max', 'fixed', "percentage_of_debt"]),
                    paymentFixedAmount: faker.number.float({min: 100, max: 1000, fractionDigits: 2}),
                    paymentPercentage: faker.number.float({min: 1, max: 20, fractionDigits: 2}),
                },
            ],
            taxDeferredSavings: faker.number.float({min: 5000, max: 100000, fractionDigits: 2}),
            taxDeferredContributionFixedAmount: faker.number.float({min: 1000, max: 10000, fractionDigits: 2}),
            taxDeferredContributionStrategy: faker.helpers.arrayElement([
                'fixed',
                'percent_of_income',
                'until_company_match',
                'max',
            ]),
            taxDeferredContributionPercentage: faker.number.float({min: 1, max: 20, fractionDigits: 2}),
            taxDeferredGrowthRate: faker.number.float({min: 1, max: 10, fractionDigits: 2}),
            employerContributionStrategy: faker.helpers.arrayElement(['none', 'fixed', 'percentage_of_compensation']),
            employerMatchPercentage: faker.number.float({min: 1, max: 20, fractionDigits: 2}),
            employerMatchPercentageLimit: faker.number.float({min: 1, max: 15, fractionDigits: 2}),
            employerContributionPercentage: faker.number.float({min: 1, max: 10, fractionDigits: 2}),
            employerContributionFixedAmount: faker.number.float({min: 1000, max: 10000, fractionDigits: 2}),
            iraTaxableSavings: faker.number.float({min: 1000, max: 50000, fractionDigits: 2}),
            iraTaxableContributionFixedAmount: faker.number.float({min: 1000, max: 5000, fractionDigits: 2}),
            iraTaxableContributionStrategy: faker.helpers.arrayElement(['fixed', 'percent_of_income', 'max']),
            iraTaxableContributionPercentage: faker.number.float({min: 1, max: 15, fractionDigits: 2}),
            iraTaxDeferredSavings: faker.number.float({min: 1000, max: 50000, fractionDigits: 2}),
            iraTaxDeferredContributionFixedAmount: faker.number.float({min: 1000, max: 5000, fractionDigits: 2}),
            iraTaxDeferredContributionStrategy: faker.helpers.arrayElement(['fixed', 'percent_of_income', 'max']),
            iraTaxDeferredContributionPercentage: faker.number.float({min: 1, max: 15, fractionDigits: 2}),
            iraGrowthRate: faker.number.float({min: 1, max: 10, fractionDigits: 2}),
            taxableSavings: faker.number.float({min: 1000, max: 50000, fractionDigits: 2}),
            taxableContributionFixedAmount: faker.number.float({min: 1000, max: 5000, fractionDigits: 2}),
            taxableContributionStrategy: faker.helpers.arrayElement(['fixed', 'percent_of_income']),
            taxableContributionPercentage: faker.number.float({min: 1, max: 15, fractionDigits: 2}),
            taxableGrowthRate: faker.number.float({min: 1, max: 10, fractionDigits: 2}),
            inflationRate: faker.number.float({min: 1, max: 5, fractionDigits: 2}),
            inflationGrowthStrategy: faker.helpers.arrayElement(['fixed', 'percentage_increase']),
            retirementStrategy: faker.helpers.arrayElement(['age', 'percentRule', 'targetSavings', 'debitFree']),
            retirementWithdrawalRate: faker.number.float({min: 3, max: 5, fractionDigits: 2}),
            retirementIncomeGoal: faker.number.float({min: 20000, max: 100000, fractionDigits: 2}),
            retirementAge: faker.number.int({min: 60, max: 70}),
            retirementSavingsAmount: faker.number.float({min: 500000, max: 2000000, fractionDigits: 2}),
            allowNegativeDisposableIncome: faker.helpers.arrayElement(['none', 'full', 'minimum_only']),
            investmentGrowthStrategy: faker.helpers.arrayElement(['start', 'end'])
        };
    }
});
