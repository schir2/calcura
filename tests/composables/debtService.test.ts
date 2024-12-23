import { describe, expect, it, vi } from 'vitest';
import { useDebtService } from '~/composables/api/useDebtService';

vi.mock('#app', () => ({
    useRuntimeConfig: () => ({
        public: {
            apiBaseUrl: 'https://192.168.255.66/api/',
        },
    }),
}));

describe('debtConfigsService Integration Tests', () => {
    let createdId: number | null = null;

    it('should fetch a list of debt configs', async () => {
        const debtService = useDebtService();
        const configs = await debtService.list();
        expect(Array.isArray(configs)).toBe(true);
    });

    it('should create a new debt config', async () => {
        const debtService = useDebtService()
        const newConfig = {
            name: `Test Loan ${Date.now()}`,
            principal: 5000,
            interest_rate: 5.0,
            payment_minimum: 500,
            payment_strategy: 'minimum_payment',
        };
        const created = await debtService.create(newConfig);
        expect(created).toBeDefined();
        expect(created.id).toBeDefined();
        expect(created.name).toBe(newConfig.name);
        createdId = created.id;
    });

    it('should fetch the newly created debt config by id', async () => {
        if (createdId == null) throw new Error('No config created in previous test');

        const debtService = useDebtService();
        const fetched = await debtService.get(createdId);
        expect(fetched).toBeDefined();
        expect(fetched.id).toBe(createdId);
    });

    it('should delete the created debt config', async () => {
        if (createdId == null) throw new Error('No config created in previous test');

        const debtService = useDebtService();
        await debtService.delete(createdId);

        let errorCaught = false;
        try {
            await debtService.get(createdId);
        } catch (err) {
            errorCaught = true;
        }

        expect(errorCaught).toBe(true);
    });
});
