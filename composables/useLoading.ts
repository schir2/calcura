import {useLoadingBar} from 'naive-ui'
import {ref} from 'vue'

export const useLoading = () => {


    const loadingBar = useLoadingBar()
    const disabledRef = ref(true)

    function start() {
        loadingBar.start()
        disabledRef.value = false
    }

    function finish() {
        loadingBar.finish()
        disabledRef.value = true
    }

    function error() {
        disabledRef.value = true
        loadingBar.error()
    }

    return {loadingBar, disabledRef, start, finish}
}