import {useThemeStore} from '@/stores/themeStore';

export default defineNuxtPlugin({
    name: 'theme',
    async setup(nuxtApp){
        const themeStore = useThemeStore();
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : themeStore.theme;
        themeStore.setTheme(initialTheme);

        watch(
            () => themeStore.theme,
            (newTheme) => {
                themeStore.setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            }
        );
    }
})