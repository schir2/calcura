// @vitest-environment nuxt
import {describe, it, expect, beforeEach, vi} from 'vitest'
import {ref} from 'vue'
import {mountSuspended, mockNuxtImport} from '@nuxt/test-utils/runtime'
import ThemeSwitcher from '~/components/base/ThemeSwitcher.vue'

const colorMode = ref<'dark' | 'light'>('dark')

// Mimic the real composable: colorModePreference.set drives colorMode.
const setPreference = vi.fn((value: 'dark' | 'light') => {
    colorMode.value = value
})

mockNuxtImport('useNaiveColorMode', () => {
    return () => ({
        colorMode,
        colorModePreference: {get: () => colorMode.value, set: setPreference},
        colorModeForced: ref(null),
    })
})

const stubs = {
    'base-ico': true,
    // Render n-button as a real button so @click fires on native click.
    'n-button': {template: '<button @click="$emit(\'click\')"><slot/><slot name="icon"/></button>'},
}

describe('ThemeSwitcher', () => {
    beforeEach(() => {
        colorMode.value = 'dark'
        setPreference.mockClear()
    })

    it('switches dark -> light and light -> dark on click', async () => {
        const wrapper = await mountSuspended(ThemeSwitcher, {global: {stubs}})

        await wrapper.get('button').trigger('click')
        expect(setPreference).toHaveBeenLastCalledWith('light')
        expect(colorMode.value).toBe('light')

        await wrapper.get('button').trigger('click')
        expect(setPreference).toHaveBeenLastCalledWith('dark')
        expect(colorMode.value).toBe('dark')
    })
})
