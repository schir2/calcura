import 'fake-indexeddb/auto';
import {beforeEach, describe, expect, it} from 'vitest';
import {useNuxtApp} from '#app';
import type {PlanConfig, PlanConfigWithIds} from '~/models/plan/PlanConfig';
import planService from '~/services/planService';
import dbPlugin from '~/services/dbService';
import type Dexie from 'dexie';

describe('PlanService', () => {
    let db: Dexie;

    beforeEach(async () => {
        // Set up the database plugin and simulate Nuxt plugin registration
        const nuxtApp = useNuxtApp();
        const {provide} = await dbPlugin.setup();
        db = provide.db;

        // Register the database in the NuxtApp mock context
        nuxtApp.provide('db', db);

        // Clear all tables
        const tables = db.tables;
        for (const table of tables) {
            await table.clear();
        }
    });

    describe('loadFullPlanConfig', () => {
        it('should load a full plan configuration from IDs', async () => {
            const mockPlanConfigWithIds: PlanConfigWithIds = {
                id: 1,
                name: 'Test Plan',
                age: 30,
                year: 2023,
                inflationRate: 0.02,
                allowNegativeDisposableIncome: 'none',
                retirementId: 1,
                cashId: 2,
                taxId: 3,
                incomeIds: [4],
                expenseIds: [5],
                debtIds: [6],
                taxDeferredInvestmentIds: [7],
                brokerageInvestmentIds: [8],
                iraInvestmentIds: [9],
            };

            // Set up mock data in IndexedDB tables
            await db.table('retirements').add({id: 1, name: 'Retirement Config'});
            await db.table('cashes').add({id: 2, name: 'Cash Config'});
            await db.table('taxes').add({id: 3, name: 'Tax Config'});
            await db.table('incomes').bulkAdd([{id: 4, name: 'Income Config'}]);
            await db.table('expenses').bulkAdd([{id: 5, name: 'Expense Config'}]);
            await db.table('debts').bulkAdd([{id: 6, name: 'Debt Config'}]);
            await db.table('taxDeferredInvestments').bulkAdd([{id: 7, name: 'Tax Deferred Investment Config'}]);
            await db.table('brokerageInvestments').bulkAdd([{id: 8, name: 'Brokerage Investment Config'}]);
            await db.table('iraInvestments').bulkAdd([{id: 9, name: 'IRA Investment Config'}]);

            // Act
            const result = await planService.getPlanById(1);

            // Assert
            expect(result).toBeDefined();
            expect(result.retirement).toEqual({id: 1, name: 'Retirement Config'});
            expect(result.cash).toEqual({id: 2, name: 'Cash Config'});
            expect(result.tax).toEqual({id: 3, name: 'Tax Config'});
            expect(result.incomes.length).toBe(1);
            expect(result.expenses.length).toBe(1);
            expect(result.debts.length).toBe(1);
        });

        it('should throw an error if required configurations are not loaded', async () => {
            // Arrange
            const mockPlanConfigWithIds: PlanConfigWithIds = {
                id: 1,
                name: 'Test Plan',
                age: 30,
                year: 2023,
                inflationRate: 0.02,
                allowNegativeDisposableIncome: 'none',
                retirementId: 1,
                cashId: 2,
                taxId: 3,
                incomeIds: [],
                expenseIds: [],
                debtIds: [],
                taxDeferredInvestmentIds: [],
                brokerageInvestmentIds: [],
                iraInvestmentIds: [],
            };

            // Act & Assert
            await expect(planService.getPlanById(1)).rejects.toThrow('Failed to load required configurations');
        });
    });

    describe('getPlanById', () => {
        it('should fetch the full plan by ID', async () => {
            // Arrange
            const mockPlanConfigWithIds: PlanConfigWithIds = {
                id: 1,
                name: 'Test Plan',
                age: 30,
                year: 2023,
                inflationRate: 0.02,
                allowNegativeDisposableIncome: 'none',
                retirementId: 1,
                cashId: 2,
                taxId: 3,
                incomeIds: [],
                expenseIds: [],
                debtIds: [],
                taxDeferredInvestmentIds: [],
                brokerageInvestmentIds: [],
                iraInvestmentIds: [],
            };

            await db.table('plans').add(mockPlanConfigWithIds);
            await db.table('retirements').add({id: 1, name: 'Retirement Config'});
            await db.table('cashes').add({id: 2, name: 'Cash Config'});
            await db.table('taxes').add({id: 3, name: 'Tax Config'});

            // Act
            const result: PlanConfig = await planService.getPlanById(1);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.retirement).toEqual({id: 1, name: 'Retirement Config'});
            expect(result.cash).toEqual({id: 2, name: 'Cash Config'});
            expect(result.tax).toEqual({id: 3, name: 'Tax Config'});
        });

        it('should throw an error if the plan is not found', async () => {
            // Act & Assert
            await expect(planService.getPlanById(99)).rejects.toThrow('PlanConfig not found');
        });
    });

    describe('addPlan', () => {
        it('should add a new plan', async () => {
            // Arrange
            const mockPlanConfig: PlanConfig = {
                id: 1,
                name: 'New Plan',
                age: 30,
                year: 2023,
                inflationRate: 0.02,
                allowNegativeDisposableIncome: 'none',
                retirement: {id: 1, name: 'Retirement Config', lifeExpectancy: 80, retirementStrategy: 'age', retirementWithdrawalRate: 4, retirementIncomeGoal: 50000, retirementAge: 65, retirementSavingsAmount: 200000},
                cash: {id: 2, name: 'Cash Config', initialAmount: 10000, cashMaintenanceStrategy: 'fixedCashReserve', reserveAmount: 5000, reserveMonths: 6},
                tax: {id: 3, taxStrategy: 'simple', taxRate: 0.25},
                incomes: [],
                expenses: [],
                debts: [],
                taxDeferredInvestments: [],
                brokerageInvestments: [],
                iraInvestments: [],
            };

            // Act
            const result = await planService.addPlan(mockPlanConfig);

            // Assert
            expect(result).toBe(1);
        });
    });

    describe('deletePlan', () => {
        it('should delete a plan by ID', async () => {
            // Arrange
            const planId = 1;
            await db.table('plans').add({id: planId, name: 'Plan to Delete'});

            // Act
            await planService.deletePlan(planId);

            // Assert
            const deletedPlan = await db.table('plans').get(planId);
            expect(deletedPlan).toBeUndefined();
        });
    });
});
