import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it} from 'vitest';


describe('Auth Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    it('initial values', () => {
        const authStore = useAuthStore()
        expect(authStore.user).toBe(null)
        expect(authStore.session).toBe(null)
        expect(authStore.isAuthenticated).toBe(false)
    })
})
