import 'fake-indexeddb/auto';
import {beforeEach, describe, expect, it} from 'vitest';
import Dexie from 'dexie';
import {DbService, dbService} from "~/services/dbService";

describe('db Plugin', () => {
    let dbInstance: DbService;
    beforeEach(async () => {

        // Access the provided db instance
        dbInstance = dbService;
    });

    it('should initialize the Dexie database with correct tables', async () => {
        expect(dbInstance).toBeInstanceOf(Dexie);

        const tables = [
            'incomes',
            'cashes',
            'debts',
            'expenses',
            'retirements',
            'iraInvestments',
            'taxes',
            'taxDeferredInvestments',
            'plans',
        ];

        // Check that all tables exist
        tables.forEach((table) => {
            expect(dbInstance.tables.map((t) => t.name)).toContain(table);
        });
    });

    it('should create a new record in the incomes table', async () => {
        const income = {
            name: 'Test Income',
            grossIncome: 100000,
            growthRate: 0.05,
            incomeType: 'Salary',
        };

        // Add a new record to the incomes table
        const id = await dbInstance.table('incomes').add(income);

        // Fetch the record back to verify
        const record = await dbInstance.table('incomes').get(id);
        expect(record).toMatchObject(income);
    });

    it('should create a new record in the cashes table', async () => {
        const cashConfig = {
            name: 'Emergency Fund',
            initialAmount: 5000,
            cashMaintenanceStrategy: 'Fixed',
            reserveAmount: 10000,
            reserveMonths: 6,
        };

        // Add a new record to the cashes table
        const id = await dbInstance.cashes.add(cashConfig);

        // Fetch the record back to verify
        const record = await dbInstance.table('cashes').get(id);
        expect(record).toMatchObject(cashConfig);
    });

    it('should fail when accessing an undefined table', async () => {
        expect(() => dbInstance.table('undefinedTable')).toThrowError();
    });
});
