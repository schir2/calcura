import Dexie, {type EntityTable} from 'dexie';
import type IncomeConfig from '~/models/income/IncomeConfig';
import type CashConfig from '~/models/cash/CashConfig';
import type DebtConfig from '~/models/debt/DebtConfig';
import type ExpenseConfig from '~/models/expense/ExpenseConfig';
import type {PlanConfig, PlanConfigWithIds} from '~/models/plan/PlanConfig';
import type RetirementConfig from '~/models/retirement/RetirementConfig';
import type IraInvestmentConfig from '~/models/ira/IraInvestmentConfig';
import type TaxConfig from '~/models/tax/TaxConfig';
import type TaxDeferredInvestmentConfig from '~/models/taxDeferred/TaxDeferredInvestmentConfig';


export default defineNuxtPlugin({
    name: 'db',
    async setup() {

        const db = new Dexie('FinancialPlanningDB') as Dexie & {
            incomes: EntityTable<IncomeConfig, 'id'>;
            cashes: EntityTable<CashConfig, 'id'>;
            debts: EntityTable<DebtConfig, 'id'>;
            expenses: EntityTable<ExpenseConfig, 'id'>;
            plans: EntityTable<PlanConfigWithIds, 'id'>;
            retirementConfigs: EntityTable<RetirementConfig, 'id'>;
            iraInvestmentConfigs: EntityTable<IraInvestmentConfig, 'id'>;
            taxConfigs: EntityTable<TaxConfig, 'id'>;
            taxDeferredInvestmentConfigs: EntityTable<TaxDeferredInvestmentConfig, 'id'>;

        };
        db.version(1).stores({
            incomes: '++id, name, grossIncome, growthRate, incomeType',
            cashConfigs: '++id, name, initialAmount, cashMaintenanceStrategy, reserveAmount, reserveMonths',
            debts: '++id, name, principal, interestRate, paymentMinimum, paymentStrategy, paymentFixedAmount, paymentPercentage',
            expenses: '++id, name, amount, type, frequency, isEssential, isTaxDeductible',
            retirementConfigs: '++id, name, lifeExpectancy, retirementStrategy, retirementWithdrawalRate, retirementIncomeGoal, retirementAge, retirementSavingsAmount',
            iraInvestmentConfigs: '++id, name, iraType, growthApplicationStrategy, growthRate, initialBalance, contributionStrategy, contributionPercentage, contributionFixedAmount',
            taxConfigs: '++id, taxStrategy, taxRate',
            taxDeferredInvestmentConfigs: '++id, name, growthApplicationStrategy, growthRate, initialBalance, electiveContributionStrategy, electiveContributionPercentage, electiveContributionFixedAmount, employerContributes, employerContributionStrategy, employerCompensationMatchPercentage, employerContributionFixedAmount, employerMatchPercentage, employerMatchPercentageLimit',
            plans: 'id, name, age, year, inflationRate, allowNegativeDisposableIncome, retirementId, cashId, taxId, incomeIds, expenseIds, debtIds, taxDeferredInvestmentIds, iraInvestmentIds',


        });
        return {
            provide: {
                db
            }
        }
    }
})