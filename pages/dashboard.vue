<template>
  <h2 class="text-2xl mb-2">Summary</h2>
  <div class="flex gap-2 flex-wrap">
    <dashboard-income-annual @click="$router.push('/incomes')" class="w-64" :incomes="incomes"/>
    <dashboard-cash-reserve-total @click="$router.push('/cash-reserves')" class="w-64" :cashReserves="cashReserves"/>
    <dashboard-expense-annual @click="$router.push('/expenses')" class="w-64" :expenses="expenses"/>
    <dashboard-debt-total @click="$router.push('/debts')" class="w-64" :debts="debts"/>
  </div>
</template>
<script lang="ts" setup>
import type {Income} from "~/models/income/Income";
import type {Expense} from "~/models/expense/Expense";
import type {Debt} from "~/models/debt/Debt";
import type {CashReserve} from "~/models/cashReserve/CashReserve";

definePageMeta({
      title: 'Dashboard',
      layout: 'default',
    }
)
const incomes = ref<Income[]>([])
const {list: listIncomes} = useIncomeService()

const expenses = ref<Expense[]>([])
const {list: listExpenses} = useExpenseService()

const debts = ref<Debt[]>([])
const {list: listDebts} = useDebtService()

const cashReserves = ref<CashReserve[]>([])
const {list: listCashReserves} = useCashReserveService()

onMounted(async () => {
  incomes.value = await listIncomes()
  expenses.value = await listExpenses()
  debts.value = await listDebts()
  cashReserves.value = await listCashReserves()
})
</script>
