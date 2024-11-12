import type FormData from '~/types/FormData';
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
import {
    assertDefined,
    calculateTaxDeferredContributionLimit,
    calculateTaxDeferredElectiveContributionCatchUpLimit,
    calculateTaxDeferredElectiveContributionLimit
} from "~/utils";
import {TAX_DEFERRED_CATCH_UP_AGE, TAX_DEFERRED_LIMIT_INFLATION_RATE} from "~/constants/financial";
import Debt from "~/models/Debt";

export default class Row {
    age: number;
    year: number;
    lifeExpectancy: number;

    /* Cash and Disposable Income */
    cashStartOfYear: number;
    cashEndOfYear: number;

    /* Income */
    incomeGrowthAmount?: number;
    incomePreTaxed: number;
    incomeTaxable?: number;
    incomeTaxed?: number;
    incomeDisposable?: number;
    incomeGrowthStrategy: GrowthStrategy;
    incomeGrowthRate: number;

    /* Tax */
    incomeTaxAmount?: number;
    incomeTaxRate: number;
    incomeTaxStrategy: IncomeTaxStrategy;
    incomeTaxFilingStatus: string;
    incomeTaxNumberOfDependents: string;

    /* Expenses */
    expenseAmount: number;
    expenseRate: number;
    expenseGrowthAmount?: number
    expenseGrowthStrategy: ExpensesGrowthStrategy;

    /* Debt */
    debts: Debt[] = [];
    debtStartOfYear: number;
    debtEndOfYear: number;

    /* Tax-Deferred Savings */
    taxDeferredSavingsStartOfYear: number;
    taxDeferredContributionFixedAmount: number;
    taxDeferredContributionStrategy: ContributionStrategy;
    taxDeferredContribution: number;
    taxDeferredGrowthAmount?: number;
    taxDeferredContributionPercentage: number;
    taxDeferredSavingsEndOfYear: number;
    taxDeferredGrowthRate: number;
    taxDeferredContributionLifetime: number;

    taxDeferredContributionLimitInflationRate: number;
    taxDeferredContributionElectiveCatchUpLimit: number;
    taxDeferredContributionElectiveLimit: number;
    taxDeferredContributionLimit: number;
    taxDeferredContributionElectiveLimitApplied: number;
    taxDeferredContributionLimitApplied: number;

    /* Employer Contributions */
    employerContributionStrategy: EmployerContributionStrategy;
    employerContribution: number;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;
    employerContributionPercentage: number;
    employerContributionFixedAmount: number;
    employerSavingsStartOfYear: number;
    employerSavingsEndOfYear: number;
    employerGrowthAmount?: number;
    employerContributionLifetime: number;

    /* IRA Savings */
    iraTaxableSavingsStartOfYear: number;
    iraTaxableSavingsEndOfYear: number;
    iraTaxableContribution: number;
    iraTaxableContributionFixedAmount: number;
    iraTaxableContributionStrategy: IraContributionStrategy;
    iraTaxableContributionPercentage: number;
    iraTaxableContributionLifetime: number;
    iraTaxableGrowthAmount?: number;

    iraTaxDeferredSavingsStartOfYear: number;
    iraTaxDeferredSavingsEndOfYear: number;
    iraTaxDeferredContribution: number;
    iraTaxDeferredContributionFixedAmount: number;
    iraTaxDeferredContributionStrategy: IraContributionStrategy;
    iraTaxDeferredContributionPercentage: number;
    iraTaxDeferredContributionLifetime: number;
    iraTaxDeferredGrowthAmount?: number;

    iraGrowthRate: number;
    iraContributionLimit?: number;
    iraContributionCatchUpLimit?: number;


    /* Taxable Savings */
    taxableSavingsStartOfYear: number;
    taxableSavingsEndOfYear: number;
    taxableContributionFixedAmount: number;
    taxableContribution: number;
    taxableContributionStrategy: TaxableContributionStrategy;
    taxableContributionLifetime: number;
    taxableContributionPercentage: number;
    taxableGrowthRate: number;
    taxableGrowthAmount?: number;

    /* Inflation */
    inflationRate: number;
    inflationGrowthStrategy: InflationGrowthStrategy;
    investmentGrowthStrategy: InvestmentGrowthStrategy;

    /* Calculated Fields */
    savingsStartOfYear: number;
    savingsEndOfYear: number;
    taxableSpending: number;
    taxDeferredSpending: number;

    /* Retirement */
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;
    retirementIncomeProjected?: number;

    constructor(formData: FormData) {
        this.age = formData.age;
        this.year = formData.year;
        this.lifeExpectancy = formData.lifeExpectancy;
        this.retirementStrategy = formData.retirementStrategy;
        this.retirementWithdrawalRate = formData.retirementWithdrawalRate;
        this.retirementIncomeGoal = formData.retirementIncomeGoal;
        this.retirementAge = formData.retirementAge;
        this.retirementSavingsAmount = formData.retirementSavingsAmount;

        this.cashStartOfYear = 0;
        this.cashEndOfYear = formData.cash;

        this.incomePreTaxed = formData.incomePreTaxed;
        this.incomeGrowthStrategy = formData.incomeGrowthStrategy;
        this.incomeGrowthRate = formData.incomeGrowthRate;
        this.incomeTaxRate = formData.incomeTaxRate;
        this.incomeTaxStrategy = formData.incomeTaxStrategy;
        this.incomeTaxFilingStatus = formData.incomeTaxFilingStatus;
        this.incomeTaxNumberOfDependents = formData.incomeTaxNumberOfDependents;

        this.expenseAmount = formData.expenses;
        this.expenseRate = formData.expenseRate;
        this.expenseGrowthStrategy = formData.expensesGrowthStrategy;

        this.debts = formData.debts.map((debtData) => new Debt(debtData));
        this.debtStartOfYear = this.calculateTotalDebtStartOfYear();
        this.debtEndOfYear = this.debtStartOfYear

        this.taxDeferredSavingsStartOfYear = 0;
        this.taxDeferredSavingsEndOfYear = formData.taxDeferredSavings;
        this.taxDeferredContributionFixedAmount = formData.taxDeferredContributionFixedAmount;
        this.taxDeferredContributionStrategy = formData.taxDeferredContributionStrategy;
        this.taxDeferredContributionPercentage = formData.taxDeferredContributionPercentage;
        this.taxDeferredGrowthRate = formData.taxDeferredGrowthRate;
        this.taxDeferredContribution = 0
        this.taxDeferredContributionLifetime = 0;

        this.taxDeferredContributionLimitInflationRate = TAX_DEFERRED_LIMIT_INFLATION_RATE;
        this.taxDeferredContributionElectiveCatchUpLimit = calculateTaxDeferredElectiveContributionCatchUpLimit(this.year);
        this.taxDeferredContributionElectiveLimit = calculateTaxDeferredElectiveContributionLimit(this.year)
        this.taxDeferredContributionLimit = calculateTaxDeferredContributionLimit(this.year);
        this.taxDeferredContributionElectiveLimitApplied = this.calculateTaxDeferredContributionElectiveLimitApplied();
        this.taxDeferredContributionLimitApplied = this.calculateTaxDeferredContributionLimitApplied();

        this.employerContributionStrategy = formData.employerContributionStrategy;
        this.employerMatchPercentage = formData.employerMatchPercentage;
        this.employerMatchPercentageLimit = formData.employerMatchPercentageLimit;
        this.employerContributionPercentage = formData.employerContributionPercentage;
        this.employerContributionFixedAmount = formData.employerContributionFixedAmount;
        this.employerSavingsStartOfYear = 0;
        this.employerSavingsEndOfYear = 0;
        this.employerContribution = 0;
        this.employerContributionLifetime = 0;

        this.iraTaxableSavingsStartOfYear = 0;
        this.iraTaxableSavingsEndOfYear = formData.iraTaxableSavings;
        this.iraTaxableContributionFixedAmount = formData.iraTaxableContributionFixedAmount;
        this.iraTaxableContributionStrategy = formData.iraTaxableContributionStrategy;
        this.iraTaxableContribution = 0
        this.iraTaxableContributionPercentage = formData.iraTaxableContributionPercentage;
        this.iraTaxableContributionLifetime = 0;

        this.iraTaxDeferredSavingsStartOfYear = 0;
        this.iraTaxDeferredSavingsEndOfYear = formData.iraTaxDeferredSavings;
        this.iraTaxDeferredContributionFixedAmount = formData.iraTaxDeferredContributionFixedAmount;
        this.iraTaxDeferredContributionStrategy = formData.iraTaxDeferredContributionStrategy;
        this.iraTaxDeferredContribution = 0;
        this.iraTaxDeferredContributionPercentage = formData.iraTaxDeferredContributionPercentage;
        this.iraTaxDeferredContributionLifetime = 0;

        this.iraGrowthRate = formData.iraGrowthRate;

        this.taxableSavingsStartOfYear = 0;
        this.taxableSavingsEndOfYear = formData.taxableSavings;
        this.taxableContributionFixedAmount = formData.taxableContributionFixedAmount;
        this.taxableContributionStrategy = formData.taxableContributionStrategy;
        this.taxableContribution = 0
        this.taxableContributionLifetime = 0;
        this.taxableContributionPercentage = formData.taxableContributionPercentage;
        this.taxableGrowthRate = formData.taxableGrowthRate;
        this.taxableGrowthAmount = undefined;
        this.inflationRate = formData.inflationRate;
        this.inflationGrowthStrategy = formData.inflationGrowthStrategy;


        this.taxableSpending = 0;
        this.taxDeferredSpending = 0;
        this.investmentGrowthStrategy = 'start'
        this.savingsStartOfYear = 0
        this.savingsEndOfYear = this.taxableSavingsEndOfYear + this.taxDeferredSavingsEndOfYear + this.iraTaxableSavingsEndOfYear + this.iraTaxDeferredSavingsEndOfYear + this.employerSavingsEndOfYear

    }

    calculateTaxableContribution(): number {
        switch (this.taxableContributionStrategy) {
            case 'fixed':
                return this.taxableContributionFixedAmount
            case 'percent_of_income':
                return this.incomePreTaxed * (this.taxableContributionPercentage / 100)

        }
    }

    calculateIraTaxableContribution(): number {
        switch (this.iraTaxableContributionStrategy) {
            case 'fixed':
                return this.iraTaxableContributionFixedAmount
            case 'percent_of_income':
                return this.incomePreTaxed * (this.iraTaxableContributionPercentage / 100)
            case 'max':
                assertDefined(this.iraContributionLimit, 'iraContributionLimit')
                assertDefined(this.iraContributionCatchUpLimit, 'iraContributionCatchUpLimit')
                return Number(this.age) >= 50 ? this.iraContributionCatchUpLimit : this.iraContributionLimit
        }

    }

    calculateIraDeferredContribution(): number {
        assertDefined(this.iraContributionCatchUpLimit, 'iraContributionCatchUpLimit')
        assertDefined(this.iraContributionLimit, 'iraContributionLimit')
        switch (this.iraTaxDeferredContributionStrategy) {
            case 'fixed':
                return this.iraTaxDeferredContributionFixedAmount
            case 'percent_of_income':
                return this.incomePreTaxed * (this.iraTaxDeferredContributionPercentage / 100)
            case 'max':
                return Number(this.age) >= 50 ? this.iraContributionCatchUpLimit : this.iraContributionLimit
        }

    }

    calculateEmployerContribution(): number {
        assertDefined(this.taxDeferredContributionLimitApplied, 'taxDeferredContributionElectiveTotalLimitApplied')
        let employerContribution = 0
        const electiveContribution = this.calculateTaxDeferredContribution()

        switch (this.employerContributionStrategy) {
            case 'none':
                break
            case "percentage_of_contribution":
                const employerMatch = electiveContribution * (this.employerMatchPercentage / 100);
                const maxEmployerMatch = this.incomePreTaxed * this.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.employerContributionFixedAmount
                break
            case "percentage_of_compensation":
                employerContribution = this.incomePreTaxed * (this.employerContributionPercentage / 100)
                break
        }
        return Math.min(employerContribution, this.taxDeferredContributionLimitApplied - electiveContribution)

    }

    calculateTaxDeferredContribution(): number {
        assertDefined(this.taxDeferredContributionElectiveLimitApplied, 'taxDeferredContributionElectiveLimitApplied')
        let electiveContribution = 0
        switch (this.taxDeferredContributionStrategy) {
            case 'fixed':
                electiveContribution = this.taxDeferredContributionFixedAmount
                break
            case 'percent_of_income':
                electiveContribution = this.incomePreTaxed * (this.taxDeferredContributionPercentage / 100)
                break
            case 'until_company_match':
                electiveContribution = this.employerMatchPercentageLimit * this.incomePreTaxed / 100
                break
            case "max":
                electiveContribution = this.taxDeferredContributionElectiveLimitApplied
                break
        }
        return Math.min(electiveContribution, this.taxDeferredContributionElectiveLimitApplied)

    }

    calculateIraTaxDeferredSavingsEndOfYear() {
        assertDefined(this.iraTaxDeferredGrowthAmount, 'iraTaxDeferredGrowthAmount')
        return this.iraTaxDeferredSavingsStartOfYear + this.iraTaxDeferredContribution + this.iraTaxDeferredGrowthAmount;


    }

    calculateIraTaxDeferredGrowthAmount(): number {
        assertDefined(this.iraTaxDeferredContribution, 'iraTaxDeferredContribution')
        switch (this.investmentGrowthStrategy) {
            case 'start':
                return this.iraTaxDeferredSavingsStartOfYear * (this.iraGrowthRate / 100)
            case 'end':
                return (this.iraTaxDeferredSavingsStartOfYear + this.iraTaxDeferredContribution) * (this.iraGrowthRate / 100)
        }
    }

    calculateTaxableGrowthAmount(): number {
        switch (this.investmentGrowthStrategy) {
            case 'start':
                return this.taxableSavingsStartOfYear * (this.taxableGrowthRate / 100)
            case 'end':
                return (this.taxableSavingsStartOfYear + this.taxableContribution) * (this.taxableGrowthRate / 100)
        }
    }

    calculateTaxableSavingsEndOfYear(): number {
        assertDefined(this.taxableGrowthAmount, 'taxableGrowthAmount')
        return this.taxableSavingsStartOfYear + this.taxableContribution + this.taxableGrowthAmount;

    }

    calculateIraTaxableGrowthAmount(): number {
        switch (this.investmentGrowthStrategy) {
            case 'start':
                return this.iraTaxableSavingsStartOfYear * (this.iraGrowthRate / 100)
            case 'end':
                return (this.iraTaxableSavingsStartOfYear + this.iraTaxableContribution) * (this.iraGrowthRate / 100)
        }
    }

    calculateIraTaxableSavingsEndOfYear(): number {
        assertDefined(this.iraTaxableGrowthAmount, 'iraTaxableGrowthAmount')
        return this.iraTaxableSavingsStartOfYear + this.iraTaxableContribution + this.iraTaxableGrowthAmount;

    }

    calculateTaxDeferredGrowthAmount(): number {
        switch (this.investmentGrowthStrategy) {
            case 'start':
                return this.taxDeferredSavingsStartOfYear * (this.taxDeferredGrowthRate / 100)
            case 'end':
                return (this.taxDeferredSavingsStartOfYear + this.taxDeferredContribution) * (this.taxDeferredGrowthRate / 100)
        }
    }

    calculateTaxDeferredSavingsEndOfYear(): number {
        assertDefined(this.taxDeferredGrowthAmount, 'taxDeferredGrowthAmount')
        return this.taxDeferredSavingsStartOfYear + this.taxDeferredContribution + this.taxDeferredGrowthAmount;
    }

    calculateEmployerSavingsEndOfYear(): number {
        assertDefined(this.employerGrowthAmount, 'employerGrowthAmount')
        return this.employerSavingsStartOfYear + this.employerContribution + this.employerGrowthAmount
    }


    calculateEmployerGrowthAmount(): number {
        switch (this.investmentGrowthStrategy) {
            case 'start':
                return this.employerSavingsStartOfYear * (this.taxDeferredGrowthRate / 100)
            case 'end':
                return (this.employerSavingsStartOfYear + this.employerContribution) * (this.taxDeferredGrowthRate / 100)
        }
    }

    calculateIncomeTaxable(): number {
        return this.incomePreTaxed - this.taxDeferredSpending

    }

    calculateIncomeTaxAmount(incomeTaxable: number | undefined): number {
        incomeTaxable = incomeTaxable ?? this.incomeTaxable
        assertDefined(incomeTaxable, 'incomeTaxable')
        switch (this.incomeTaxStrategy) {
            case 'bracket':
                return incomeTaxable * this.incomeTaxRate / 100
            case 'simple':
                return incomeTaxable * this.incomeTaxRate / 100
        }
    }


    calculateIncomeTaxed(): number {
        assertDefined(this.incomeTaxable, 'incomeTaxable')
        assertDefined(this.incomeTaxAmount, 'incomeTaxAmount')
        return this.incomeTaxable - this.incomeTaxAmount;
    }


    calculateIncomeDisposable(): number {
        assertDefined(this.incomeTaxed, 'incomeTaxed')
        return this.incomeTaxed - this.taxableSpending - this.expenseAmount
    }

    calculateCashEndOfYear(): number {
        assertDefined(this.incomeDisposable, 'incomeDisposable')
        return this.incomeDisposable
    }


    calculateRetirementIncomeProjected(): number {
        return this.savingsEndOfYear * this.retirementWithdrawalRate / 100
    }


    calculateIncomeGrowthAmount(): number {
        switch (this.incomeGrowthStrategy) {
            case "fixed":
                return 0
            case "percentage_increase":
                return this.incomePreTaxed * (this.incomeGrowthRate / 100)
        }
    }

    calculateTaxDeferredContributionElectiveLimitApplied(): number {
        return this.age < TAX_DEFERRED_CATCH_UP_AGE ? this.taxDeferredContributionElectiveLimit : this.taxDeferredContributionElectiveLimit + this.taxDeferredContributionElectiveCatchUpLimit
    }

    calculateTaxDeferredContributionLimitApplied(): number {
        return this.age < TAX_DEFERRED_CATCH_UP_AGE ? this.taxDeferredContributionLimit : this.taxDeferredContributionLimit + this.taxDeferredContributionElectiveCatchUpLimit
    }

    calculateAdjustedTaxDeferredContributionLimit(): number {
        return this.taxDeferredContributionLimit * (1 + this.taxDeferredContributionLimitInflationRate / 100)
    }

    calculateAdjustedTaxDeferredContributionElectiveLimit(): number {
        return this.taxDeferredContributionElectiveLimit * (1 + this.taxDeferredContributionLimitInflationRate / 100)
    }

    calculateAdjustedTaxDeferredContributionElectiveCatchUpLimit(): number {
        return this.taxDeferredContributionElectiveCatchUpLimit * (1 + this.taxDeferredContributionLimitInflationRate / 100)
    }

    calculateInflationRate(): number {
        switch (this.inflationGrowthStrategy) {
            case "fixed":
                return this.inflationRate
            case "percentage_increase":
                return this.inflationRate
        }
    }

    hasAchievedRetirement(): boolean {
        switch (this.retirementStrategy) {
            case 'age':
                return this.age === this.retirementAge
            case 'percent_rule':
                return this.savingsEndOfYear * this.retirementWithdrawalRate / 100 > this.retirementIncomeGoal
            case 'target_savings':
                return this.retirementSavingsAmount >= this.savingsEndOfYear
            case 'debt_free':
                return this.debtEndOfYear <= 0

        }
    }

    advanceToNextYear(): Row {
        const row = structuredClone(this)
        row.age += 1
        row.year += 1

        row.inflationRate = row.calculateInflationRate()

        row.cashStartOfYear = row.cashEndOfYear

        row.incomeGrowthAmount = row.calculateIncomeGrowthAmount()
        row.incomePreTaxed += row.incomeGrowthAmount
        row.incomeTaxable = undefined
        row.incomeTaxed = undefined
        row.incomeDisposable = undefined
        row.incomeTaxAmount = undefined

        row.expenseGrowthAmount = row.calculateExpenseGrowthAmount();
        row.expenseAmount = row.calculateExpenses()

        row.debtStartOfYear = row.debtEndOfYear

        row.taxDeferredSavingsStartOfYear = row.taxDeferredSavingsEndOfYear

        row.taxDeferredContributionLimit = row.calculateAdjustedTaxDeferredContributionLimit()
        row.taxDeferredContributionElectiveLimit = row.calculateAdjustedTaxDeferredContributionElectiveLimit()
        row.taxDeferredContributionElectiveCatchUpLimit = row.calculateAdjustedTaxDeferredContributionElectiveCatchUpLimit()
        row.taxDeferredContributionElectiveLimitApplied = row.calculateTaxDeferredContributionElectiveLimitApplied();
        row.taxDeferredContributionLimitApplied = row.calculateTaxDeferredContributionLimitApplied();

        row.employerSavingsStartOfYear = row.employerSavingsEndOfYear

        row.iraTaxableSavingsStartOfYear = row.iraTaxableSavingsEndOfYear
        row.iraTaxDeferredSavingsStartOfYear = row.iraTaxDeferredSavingsEndOfYear
        row.taxableSavingsStartOfYear = row.taxableSavingsEndOfYear

        row.savingsStartOfYear = row.savingsEndOfYear

        row.taxableSpending = 0
        row.taxDeferredSpending = 0

        row.debts = row.debts.map((debt) => debt.advanceToNextYear())


        row.retirementIncomeGoal += row.retirementIncomeGoal * row.inflationRate / 100


        return row
    }

    calculateExpenses(): number {
        assertDefined(this.expenseGrowthAmount, 'expenseGrowthAmount')
        return this.expenseAmount + this.expenseGrowthAmount;
    }

    calculateExpenseGrowthAmount(): number {
        return this.expenseAmount * this.expenseRate / 100
    }

    calculateTotalDebtStartOfYear(): number {
        return this.debts.reduce((sum, debt) => sum + debt.principalStartOfYear, 0);
    }


    calculateTotalDebtEndOfYear(): number {
        return this.debts.reduce((sum, debt) => sum + debt.principalEndOfYear, 0);
    }

    recalculateTaxes(taxDeferredContribution: number): {
        newTaxableIncome: number;
        newTaxAmount: number;
        newDisposableIncome: number;
        effectiveTaxRate: number;
    } {

        assertDefined(this.incomeDisposable, 'incomeDisposable')
        assertDefined(this.incomeTaxable, 'incomeTaxable')
        assertDefined(this.incomeTaxAmount, 'incomeTaxAmount')

        const currentEffectiveTaxRate = (this.incomeTaxAmount / this.incomeTaxable) * 100;
        const availableTaxableIncome = this.incomeDisposable / (1 - currentEffectiveTaxRate / 100);
        const newTaxableIncome = this.incomeTaxable - taxDeferredContribution;
        const newTaxAmount = this.calculateIncomeTaxAmount(newTaxableIncome)
        const effectiveTaxRate = (newTaxAmount / newTaxableIncome) * 100;
        const newDisposableIncome = availableTaxableIncome * effectiveTaxRate / 100;

        // Return the updated variables
        return {
            newTaxableIncome,
            newTaxAmount,
            newDisposableIncome,
            effectiveTaxRate
        };
    }

}



