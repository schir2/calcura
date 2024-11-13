import {defineStore} from 'pinia'

type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
    state: (): {theme: Theme} => (
        {theme: 'dark',}),

    actions: {
        setTheme(newTheme: Theme) {
            this.theme = newTheme;
            document.body.setAttribute('data-theme', newTheme);
        },
        toggleTheme() {
            const newTheme = this.theme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        },
    },
});