// @vitest-environment nuxt
import {describe, it, expect, beforeEach} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useWorkspaceStore} from '~/stores/workspaceStore'

describe('workspaceStore.openCreate', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('carries seed values into the drawer for the create path', () => {
        const workspace = useWorkspaceStore()
        const seed = {name: 'Credit Card', principal: 6000, interest_rate: 22.9}

        workspace.openCreate('debt', 1, seed)

        expect(workspace.mode).toBe('create')
        expect(workspace.id).toBeNull()
        expect(workspace.planId).toBe(1)
        expect(workspace.seed).toEqual(seed)
        expect(workspace.isOpen).toBe(true)
    })

    it('leaves seed null on the no-seed create path', () => {
        const workspace = useWorkspaceStore()

        workspace.openCreate('debt', 1)

        expect(workspace.mode).toBe('create')
        expect(workspace.seed).toBeNull()
    })

    it('clears a prior seed when reused without one, and on close', () => {
        const workspace = useWorkspaceStore()

        workspace.openCreate('debt', 1, {name: 'Auto Loan'})
        workspace.openCreate('debt', 1)
        expect(workspace.seed).toBeNull()

        workspace.openCreate('debt', 1, {name: 'Mortgage'})
        workspace.close()
        expect(workspace.seed).toBeNull()
        expect(workspace.isOpen).toBe(false)
    })

    it('never carries a seed into the edit path', () => {
        const workspace = useWorkspaceStore()

        workspace.openCreate('debt', 1, {name: 'Student Loan'})
        workspace.open('debt', 99)

        expect(workspace.mode).toBe('edit')
        expect(workspace.id).toBe(99)
        expect(workspace.seed).toBeNull()
    })
})

describe('workspaceStore.openPlan', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('opens the plan target on the requested tab', () => {
        const workspace = useWorkspaceStore()

        workspace.openPlan(7, 'goal')

        expect(workspace.kind).toBe('plan')
        expect(workspace.modelName).toBeNull()
        expect(workspace.id).toBe(7)
        expect(workspace.planId).toBe(7)
        expect(workspace.planTab).toBe('goal')
        expect(workspace.mode).toBe('edit')
        expect(workspace.isOpen).toBe(true)
    })

    it('defaults to the rates tab and resets it on close', () => {
        const workspace = useWorkspaceStore()

        workspace.openPlan(7, 'timeline')
        workspace.close()
        expect(workspace.planTab).toBe('rates')

        workspace.openPlan(7)
        expect(workspace.planTab).toBe('rates')
    })
})

describe('workspaceStore.dirty', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('resets on every open and on close', () => {
        const workspace = useWorkspaceStore()

        workspace.open('debt', 1)
        workspace.dirty = true
        workspace.openPlan(7)
        expect(workspace.dirty).toBe(false)

        workspace.dirty = true
        workspace.open('debt', 1)
        expect(workspace.dirty).toBe(false)

        workspace.dirty = true
        workspace.openCreate('debt', 7)
        expect(workspace.dirty).toBe(false)

        workspace.dirty = true
        workspace.close()
        expect(workspace.dirty).toBe(false)
    })
})
