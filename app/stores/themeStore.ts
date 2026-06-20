import {darkTheme, lightTheme} from "naive-ui";

export const useThemeStore = defineStore('themeStore', () => {
    type Theme = 'light' | 'dark'
    const theme = ref<Theme>('dark')

    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    function setDarkTheme() {
        theme.value = 'dark'
    }

    function setLightTheme() {
        theme.value = 'light'
    }

    const naiveTheme = computed(()=>{
        return theme.value === 'dark' ? darkTheme : lightTheme
    })

    return {theme, toggleTheme, setDarkTheme, setLightTheme, naiveTheme}
})