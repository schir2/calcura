import {describe, expect, it} from 'vitest'
import {processTemplate} from '~/utils/templateProcessorUtils'

const defaults = {
    name: 'Debt',
    principal: 0,
    interest_rate: 6,
    payment_minimum: 0,
    payment_strategy: 'fixed',
}

describe('processTemplate', () => {
    it('lets the template win over the default where it provides a value', () => {
        const template = {name: 'Credit Card', principal: 6000, interest_rate: 22.9}
        const result = processTemplate(defaults, template)
        expect(result.name).toBe('Credit Card')
        expect(result.principal).toBe(6000)
        expect(result.interest_rate).toBe(22.9)
    })

    it('falls back to the default where the template value is null or absent', () => {
        const template = {name: 'Auto Loan', payment_minimum: null}
        const result = processTemplate(defaults, template)
        expect(result.payment_minimum).toBe(0)
        expect(result.payment_strategy).toBe('fixed')
    })

    it('returns the defaults unchanged for the no-template path (empty template)', () => {
        const result = processTemplate(defaults, {})
        expect(result).toEqual(defaults)
    })

    it('only emits keys present in the defaults, ignoring extra template columns', () => {
        const template = {name: 'Mortgage', id: 42, created_at: 'x'}
        const result = processTemplate(defaults, template)
        expect(result).not.toHaveProperty('id')
        expect(result).not.toHaveProperty('created_at')
        expect(Object.keys(result).sort()).toEqual(Object.keys(defaults).sort())
    })
})
