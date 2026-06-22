export const useIncomeStore = defineStore('incomeStore', () => {
    const loaded = ref(false)
    const incomes = ref<Income[]>([])

    return {loaded, incomes}
})