import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it} from 'vitest';

import {registerEndpoint} from '@nuxt/test-utils/runtime'

registerEndpoint('/api/auth/me/', () => ({
    username: 'tester',
    first_name: 'test',
    last_name: 'user',
    email: 'test@test.com',
    is_staff: false,
    is_active: false,
    permissions: [],
    is_superuser: false,
    groups: []
}))


describe('Auth Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    it('initial values', () => {
        const authStore = useAuthStore()
        expect(authStore.user).toBe(null)
        expect(authStore.isAuthenticated).toBe(false)
    })

    it('fetch user', async () => {
        const authStore = useAuthStore()
        await authStore.fetchUser()
        // $fetch('/api/auth/me')

    })
})