import {useThemeStore} from '@/stores/themeStore';
import {storeToRefs} from "pinia";

export default defineNuxtPlugin(() => {
    const themeStore = useThemeStore();
    const savedTheme = localStorage.getItem('theme');
    const {theme} = storeToRefs(themeStore);

    watchEffect(() => {
        document.documentElement.className = theme.value;
        document.body.setAttribute("data-theme", theme.value);
        localStorage.setItem('theme', theme.value);
    });
});