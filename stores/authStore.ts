// stores/authStore.ts
import { defineStore } from 'pinia'
import type { User } from '~/types/User'
import { useRuntimeConfig } from '#app'

interface AuthState {
    accessToken: string | null
    user: User | null
    // e.g. user: { id: number, username: string, permissions: string[] }
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: null,
        user: null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.accessToken,
        hasPermission: (state) => (perm: string) => {
            return !!state.user?.permissions?.includes(perm)
        },
    },
    actions: {
        setAccessToken(token: string) {
            this.accessToken = token
        },
        clearAuth() {
            this.accessToken = null
            this.user = null
        },
    },
})
