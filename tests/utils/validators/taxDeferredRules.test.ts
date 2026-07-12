import {describe, expect, it} from 'vitest';
import {ref} from 'vue';
import type {FormItemRule} from 'naive-ui';
import type {TaxDeferred} from '#shared/types/TaxDeferred';
import {taxDeferredRules} from '~/utils/validators/taxDeferredRules';

const incomeValidator = (model: Partial<TaxDeferred>) => {
    const {rules} = taxDeferredRules(ref(model))
    const incomeRules = rules.income_id as Array<{validator: (rule: FormItemRule, value: unknown) => true | Error}>
    return (value: unknown) => incomeRules[0]!.validator({} as FormItemRule, value)
}

describe('taxDeferredRules — income link', () => {
    it('keys the income rule on the field path the form binds (income_id)', () => {
        const {rules} = taxDeferredRules(ref({}))
        expect(rules.income_id).toBeDefined()
        expect(rules.income).toBeUndefined()
    })

    it('blocks a percentage_of_income strategy with no income selected', () => {
        const validate = incomeValidator({elective_contribution_strategy: 'percentage_of_income'})
        expect(validate(null)).toBeInstanceOf(Error)
        expect(validate(undefined)).toBeInstanceOf(Error)
    })

    it('accepts a percentage_of_income strategy once an income is selected', () => {
        const validate = incomeValidator({elective_contribution_strategy: 'percentage_of_income'})
        expect(validate(1)).toBe(true)
    })

    it('does not require an income for other strategies', () => {
        for (const strategy of ['fixed', 'max', 'until_company_match', 'none'] as const) {
            const validate = incomeValidator({elective_contribution_strategy: strategy})
            expect(validate(null), strategy).toBe(true)
        }
    })
})
