import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { debtService } from '~/services/debtService'

describe('debtConfigsService Integration Tests', () => {
    let createdId: number | null = null

    it('should fetch a list of debt configs', async () => {
        const configs = await debtService.fetchList()
        expect(Array.isArray(configs)).toBe(true)
    })

    it('should create a new debt config', async () => {
        const newConfig = {
            name: `Test Loan ${Date.now()}`,
            principal: 5000,
            interest_rate: 5.0,
            payment_minimum: 500,
            payment_strategy: 'minimum_payment'
        }
        const created = await debtService.create(newConfig)
        expect(created).toBeDefined()
        expect(created.id).toBeDefined()
        expect(created.name).toBe(newConfig.name)
        createdId = created.id
    })

    it('should fetch the newly created debt config by id', async () => {
        if (createdId == null) throw new Error('No config created in previous test')

        const fetched = await debtService.fetchOne(createdId)
        expect(fetched).toBeDefined()
        expect(fetched.id).toBe(createdId)
    })

    it('should delete the created debt config', async () => {
        if (createdId == null) throw new Error('No config created in previous test')

        await debtService.delete(createdId)

        let errorCaught = false
        try {
            await debtService.fetchOne(createdId)
        } catch (err) {
            // Expected to fail now that it's deleted
            errorCaught = true
        }

        expect(errorCaught).toBe(true)
    })
})
