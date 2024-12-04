import Dexie, {type EntityTable} from 'dexie';
import type IncomeConfig from '~/models/income/IncomeConfig';
import type CashConfig from '~/models/cash/CashConfig';
import type DebtConfig from '~/models/debt/DebtConfig';
import type ExpenseConfig from '~/models/expense/ExpenseConfig';
import type {PlanConfigWithIds} from '~/models/plan/PlanConfig';
import type RetirementConfig from '~/models/retirement/RetirementConfig';
import type IraInvestmentConfig from '~/models/ira/IraInvestmentConfig';
import type TaxConfig from '~/models/tax/TaxConfig';
import type TaxDeferredInvestmentConfig from '~/models/taxDeferred/TaxDeferredInvestmentConfig';


export class DbService extends Dexie {
    incomes!: EntityTable<IncomeConfig, 'id'>;
    cashes!: EntityTable<CashConfig, 'id'>;
    debts!: EntityTable<DebtConfig, 'id'>;
    expenses!: EntityTable<ExpenseConfig, 'id'>;
    plans!: EntityTable<PlanConfigWithIds, 'id'>;
    retirement!: EntityTable<RetirementConfig, 'id'>;
    tax!: EntityTable<TaxConfig, 'id'>;
    iraInvestments!: EntityTable<IraInvestmentConfig, 'id'>;
    taxDeferredInvestments!: EntityTable<TaxDeferredInvestmentConfig, 'id'>;
    brokerageInvestments!: EntityTable<TaxDeferredInvestmentConfig, 'id'>;

    constructor() {
        super('FinancialDb')
        this.version(1).stores({
            plans: '++id, name, age, year, inflationRate, allowNegativeDisposableIncome, retirementId, cashId, taxId, incomeIds, expenseIds, debtIds, taxDeferredInvestmentIds, iraInvestmentIds',
            incomes: '++id, name, grossIncome, growthRate, incomeType',
            cashes: '++id, name, initialAmount, cashMaintenanceStrategy, reserveAmount, reserveMonths',
            debts: '++id, name, principal, interestRate, paymentMinimum, paymentStrategy, paymentFixedAmount, paymentPercentage',
            expenses: '++id, name, amount, type, frequency, isEssential, isTaxDeductible',
            retirements: '++id, name, lifeExpectancy, retirementStrategy, retirementWithdrawalRate, retirementIncomeGoal, retirementAge, retirementSavingsAmount',
            taxes: '++id, taxStrategy, taxRate',
            iraInvestments: '++id, name, iraType, growthApplicationStrategy, growthRate, initialBalance, contributionStrategy, contributionPercentage, contributionFixedAmount',
            brokerageInvestments: '++id, name, growthApplicationStrategy, growthRate, initialBalance, contributionStrategy, contributionPercentage, contributionFixedAmount',
            taxDeferredInvestments: '++id, name, growthApplicationStrategy, growthRate, initialBalance, electiveContributionStrategy, electiveContributionPercentage, electiveContributionFixedAmount, employerContributes, employerContributionStrategy, employerCompensationMatchPercentage, employerContributionFixedAmount, employerMatchPercentage, employerMatchPercentageLimit',


        })
    }
}
export const dbService = new DbService();
