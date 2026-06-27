import {describe, it, expect, beforeEach} from 'vitest'
import {setActivePinia, createPinia} from 'pinia'
import {useModalStore} from '~/stores/modalStore'

describe('useModalStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('open', () => {
        it('sets action, model, and payload for create', () => {
            const modal = useModalStore()
            modal.open('create', 'income', {plan_id: 1})
            expect(modal.action).toBe('create')
            expect(modal.model).toBe('income')
            expect(modal.payload).toEqual({plan_id: 1})
        })

        it('sets action, model, and payload for edit', () => {
            const modal = useModalStore()
            modal.open('edit', 'expense', {id: 7})
            expect(modal.action).toBe('edit')
            expect(modal.model).toBe('expense')
            expect(modal.payload).toEqual({id: 7})
        })

        it('sets action, model, and payload for delete', () => {
            const modal = useModalStore()
            modal.open('delete', 'debt', {model: 'debt', id: 3, label: 'Car Loan', warning: 'This cannot be undone.'})
            expect(modal.action).toBe('delete')
            expect(modal.model).toBe('debt')
            expect(modal.payload).toEqual({model: 'debt', id: 3, label: 'Car Loan', warning: 'This cannot be undone.'})
        })
    })

    describe('close', () => {
        it('resets action, model, and payload to null', () => {
            const modal = useModalStore()
            modal.open('edit', 'income', {id: 5})
            modal.close()
            expect(modal.action).toBeNull()
            expect(modal.model).toBeNull()
            expect(modal.payload).toBeNull()
        })
    })

    describe('payloadFor', () => {
        it('returns the payload when action and model match', () => {
            const modal = useModalStore()
            modal.open('create', 'income', {plan_id: 42})
            expect(modal.payloadFor('create', 'income')).toEqual({plan_id: 42})
        })

        it('returns null when action does not match', () => {
            const modal = useModalStore()
            modal.open('create', 'income', {plan_id: 42})
            expect(modal.payloadFor('edit', 'income')).toBeNull()
        })

        it('returns null when model does not match', () => {
            const modal = useModalStore()
            modal.open('create', 'income', {plan_id: 42})
            expect(modal.payloadFor('create', 'expense')).toBeNull()
        })

        it('returns null when store is closed', () => {
            const modal = useModalStore()
            expect(modal.payloadFor('create', 'income')).toBeNull()
        })
    })
})