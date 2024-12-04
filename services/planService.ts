import Dexie from 'dexie';
import type {PlanConfig, PlanConfigWithIds} from "~/models/plan/PlanConfig";

export async function loadFullPlanConfig(planConfigWithIds: PlanConfigWithIds, db: Dexie): Promise<PlanConfig> {
    const [
        retirement,
        cash,
        tax,
        incomes,
        expenses,
        debts,
        taxDeferredInvestments,
        brokerageInvestments,
        iraInvestments,
    ] = await Promise.all([
        db.table('retirements').get(planConfigWithIds.retirementId),
        db.table('cashes').get(planConfigWithIds.cashId),
        db.table('taxes').get(planConfigWithIds.taxId),
        db.table('incomes').bulkGet(planConfigWithIds.incomeIds),
        db.table('expenses').bulkGet(planConfigWithIds.expenseIds),
        db.table('debts').bulkGet(planConfigWithIds.debtIds),
        db.table('taxDeferredInvestments').bulkGet(planConfigWithIds.taxDeferredInvestmentIds),
        db.table('brokerageInvestments').bulkGet(planConfigWithIds.brokerageInvestmentIds),
        db.table('iraInvestments').bulkGet(planConfigWithIds.iraInvestmentIds),
    ]);

    if (!retirement || !cash || !tax) {
        throw new Error('Failed to load required configurations');
    }

    return {
        ...planConfigWithIds,
        retirement,
        cash,
        tax,
        incomes: incomes.filter(Boolean),
        expenses: expenses.filter(Boolean),
        debts: debts.filter(Boolean),
        taxDeferredInvestments: taxDeferredInvestments.filter(Boolean),
        brokerageInvestments: brokerageInvestments.filter(Boolean),
        iraInvestments: iraInvestments.filter(Boolean),
    };
}

export default {
    async listPlans(db: Dexie): Promise<PlanConfigWithIds[]> {
        return db.table('plans').toArray();
    },

    async getPlanById(planId: number, db: Dexie): Promise<PlanConfig> {
        const planConfigWithIds = await db.table('plans').get(planId);
        if (!planConfigWithIds) {
            throw new Error('PlanConfig not found');
        }
        return await loadFullPlanConfig(planConfigWithIds, db);
    },

    // Add other methods for handling plans
    async addPlan(planConfig: PlanConfig, db: Dexie) {
        return db.table('plans').add(planConfig);
    },

    async deletePlan(planId: number, db: Dexie) {
        return db.table('plans').delete(planId);
    },
};
