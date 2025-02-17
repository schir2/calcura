<template>
  <h2 class="text-2xl mb-2">My Plans</h2>
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
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import type {Plan} from "~/models/plan/Plan";

definePageMeta({
      title: 'Dashboard',
      layout: 'default',
    }
)
const plans = ref<Plan[]>([])
const {list: listPlans} = usePlanService()

const incomes = ref<Income[]>([])
const {list: listIncomes} = useIncomeService()

const expenses = ref<Expense[]>([])
const {list: listExpenses} = useExpenseService()

const debts = ref<Debt[]>([])
const {list: listDebts} = useDebtService()

const cashReserves = ref<CashReserve[]>([])
const {list: listCashReserves} = useCashReserveService()

const rothIras = ref<RothIraInvestment[]>([])
const {list: listRothIras} = useRothIraInvestmentService()

const iras = ref<IraInvestment[]>([])
const {list: listIraInvestments} = useIraInvestmentService()

const taxDeferredInvestments = ref<TaxDeferredInvestment[]>([])
const {list: listTaxDeferredInvestments} = useTaxDeferredInvestmentService()

const brokerages = ref<BrokerageInvestment[]>([])
const {list: listBrokerages} = useBrokerageInvestmentService()

onMounted(async () => {
  plans.value = await listPlans()
  incomes.value = await listIncomes()
  expenses.value = await listExpenses()
  debts.value = await listDebts()
  cashReserves.value = await listCashReserves()
  rothIras.value = await listRothIras()
  iras.value = await listIraInvestments()
  taxDeferredInvestments.value = await listTaxDeferredInvestments()
  brokerages.value = await listBrokerages()
})
</script>
