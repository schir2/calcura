<template>
  <ClientOnly>
    <Teleport to="#right-side-bar">
      <PlanSummary v-if="plan" :plan="plan"></PlanSummary>
    </Teleport>
  </ClientOnly>
  <div v-if="plan" class="col-span-4 space-y-6">
    <IncomeList v-if="plan.incomes" :incomes="plan.incomes"
                @create="handleCreateIncome"
                @update="handleUpdateIncome"
                @delete="handleDeleteIncome"
                @remove="handleRemoveIncome"
    />
    <DebtList v-if="plan.debts" :debts="plan.debts"
              @creat="handleCreateDebt"
              @updat="handleUpdateDebt"
              @delete="handleDeleteDebt"
              @remove="handleRemoveDebt"
    ></DebtList>


    <ExpenseList v-if="plan.expenses" :expenses="plan.expenses"
                 @create="handleCreateExpense"
                 @update="handleUpdateExpense"
                 @delete="handleDeleteExpense"
                 @remove="handleRemoveExpense"
    />

    <CashReserveList v-if="plan.cashReserves" :cashReserves="plan.cashReserves"
                     @create="handleCreateCashReserve"
                     @update="handleUpdateCashReserve"
                     @delete="handleDeleteCashReserve"
                     @remove="handleRemoveCashReserve"
    />


    <BrokerageInvestmentList v-if="plan.brokerageInvestments" :brokerageInvestments="plan.brokerageInvestments"
                             @create="handleCreateBrokerageInvestment"
                             @update="handleUpdateBrokerageInvestment"
                             @delete="handleDeleteBrokerageInvestment"
                             @remove="handleRemoveBrokerageInvestment"
    />


    <IraInvestmentList v-if="plan.iraInvestments" :iraInvestments="plan.iraInvestments"
                       @create="handleCreateIraInvestment"
                       @update="handleUpdateIraInvestment"
                       @delete="handleDeleteIraInvestment"
                       @remove="handleRemoveIraInvestment"
    />


    <TaxDeferredInvestmentList v-if="plan.taxDeferredInvestments" :taxDeferredInvestments="plan.taxDeferredInvestments"
                       @create="handleCreateTaxDeferredInvestment"
                       @update="handleUpdateTaxDeferredInvestment"
                       @delete="handleDeleteTaxDeferredInvestment"
                       @remove="handleRemoveTaxDeferredInvestment"
    />

  </div>
</template>
<script setup lang="ts">
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/models/plan/PlanState";
import type {Debt, DebtPartial} from "~/models/debt/Debt";
import type {Expense, ExpensePartial} from "~/models/expense/Expense"
import type {Plan} from "~/models/plan/Plan";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {TaxDeferredInvestment, TaxDeferredInvestmentPartial} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {Income, IncomePartial} from "~/models/income/Income";
import type {BrokerageInvestment, BrokerageInvestmentPartial} from "~/models/brokerageInvestment/BrokerageInvestment";

const planService = usePlanService()
const debtService = useDebtService()
const cashReserveService = useCashReserveService()
const expenseService = useExpenseService()
const incomeService = useIncomeService()
const iraInvestmentService = useIraInvestmentService()
const brokerageInvestmentService = useBrokerageInvestmentService()
const taxDeferredInvestmentService = useTaxDeferredInvestmentService()
const route = useRoute()
const planId = Number(route.params.id)
const plan = ref<Plan | null>(null)
const loading = ref<boolean>(false);

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

async function handleCreateDebt(debtPartial: DebtPartial) {
  const debt = await debtService.create(debtPartial)
  await planService.addRelatedModel(planId, 'debts', debt.id)
  await loadPlan();
}

async function handleDeleteDebt(debt: Debt) {
  await debtService.delete(debt.id)
  await loadPlan();
}

async function handleUpdateDebt(debt: Debt) {
  await debtService.update(debt.id, debt)
  await loadPlan();
}

async function handleRemoveDebt(debtPartial: DebtPartial) {
  const debt = await debtService.create(debtPartial)
  await planService.removeRelatedModel(planId, 'debts', debt.id)
  await loadPlan();
}


async function handleCreateCashReserve(cashReservePartial: CashReserve) {
  const cashReserve = await cashReserveService.create(cashReservePartial)
  await planService.addRelatedModel(planId, 'cash_reserves', cashReserve.id)
  await loadPlan();
}

async function handleDeleteCashReserve(cashReserve: CashReserve) {
  await cashReserveService.delete(cashReserve.id)
  await loadPlan();
}

async function handleUpdateCashReserve(cashReserve: CashReserve) {
  await cashReserveService.update(cashReserve.id, cashReserve)
  await loadPlan();
}

async function handleRemoveCashReserve(cashReservePartial: CashReserve) {
  const cashReserve = await cashReserveService.create(cashReservePartial)
  await planService.removeRelatedModel(planId, 'cash_reserves', cashReserve.id)
  await loadPlan();
}

async function handleCreateIncome(incomeTemplate: IncomePartial) {
  const income = await incomeService.create(incomeTemplate)
  await planService.addRelatedModel(planId, 'incomes', income.id)
  await loadPlan();
}

async function handleDeleteIncome(income: Income) {
  await incomeService.delete(income.id)
  await loadPlan();
}

async function handleUpdateIncome(income: Income) {
  await incomeService.update(income.id, income)
  await loadPlan();
}

async function handleRemoveIncome(income: Income) {
  await planService.removeRelatedModel(planId, 'incomes', income.id)
  await loadPlan();
}


async function handleCreateExpense(expensePartial: ExpensePartial) {
  const expense = await expenseService.create(expensePartial)
  await planService.addRelatedModel(planId, 'expenses', expense.id)
  await loadPlan();
}

async function handleDeleteExpense(expense: Expense) {
  await expenseService.delete(expense.id)
  await loadPlan();
}

async function handleUpdateExpense(expense: Expense) {
  await expenseService.update(expense.id, expense)
  await loadPlan();
}

async function handleRemoveExpense(expense: Expense) {
  await planService.removeRelatedModel(planId, 'expenses', expense.id)
  await loadPlan();
}

async function handleCreateBrokerageInvestment(brokerageInvestmentPartial: BrokerageInvestmentPartial) {
  const brokerageInvestment = await brokerageInvestmentService.create(brokerageInvestmentPartial)
  await planService.addRelatedModel(planId, 'brokerage_investments', brokerageInvestment.id)
  await loadPlan();
}

async function handleDeleteBrokerageInvestment(brokerageInvestment: BrokerageInvestment) {
  await brokerageInvestmentService.delete(brokerageInvestment.id)
  await loadPlan();
}

async function handleUpdateBrokerageInvestment(brokerageInvestment: BrokerageInvestment) {
  await brokerageInvestmentService.update(brokerageInvestment.id, brokerageInvestment)
  await loadPlan();
}

async function handleRemoveBrokerageInvestment(brokerageInvestment: BrokerageInvestment) {
  await planService.removeRelatedModel(planId, 'brokerage_investments', brokerageInvestment.id)
  await loadPlan();
}


async function handleCreateIraInvestment() {
  const iraInvestmentConfig = defaultIraInvestmentFactory();
  const iraInvestment = await iraInvestmentService.create(iraInvestmentConfig)
  await planService.addRelatedModel(planId, 'ira_investments', iraInvestment.id)
  await loadPlan();
}

async function handleDeleteIraInvestment(index: number) {
  await iraInvestmentService.delete(index)
  await loadPlan();
}

async function handleUpdateIraInvestment(iraInvestment: IraInvestment) {
  await iraInvestmentService.update(iraInvestment.id, iraInvestment)
  await loadPlan();
}

async function handleRemoveIraInvestment() {
  const iraInvestmentConfig = defaultIraInvestmentFactory();
  const iraInvestment = await iraInvestmentService.create(iraInvestmentConfig)
  await planService.addRemoveModel(planId, 'ira_investments', iraInvestment.id)
  await loadPlan();
}

async function handleCreateTaxDeferredInvestment(taxDeferredInvestmentPartial: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentPartial)
  await planService.addRelatedModel(planId, 'tax_deferred_investments', taxDeferredInvestment.id)
  await loadPlan();
}

async function handleDeleteTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.delete(taxDeferredInvestment.id)
  await loadPlan();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
  await loadPlan();
}

async function handleRemoveTaxDeferredInvestment(taxDeferredInvestmentPartial: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentPartial)
  await planService.removeRelatedModel(planId, 'tax_deferred_investments', taxDeferredInvestment.id)
  await loadPlan();
}

async function loadPlan() {
  try {
    plan.value = await planService.get(planId)
    planManager = new PlanManager(plan.value);
    planStates.value = planManager.simulate();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadPlan();
});
let planManager: PlanManager | null = null
const planStates = ref<PlanState[]>([])

watch(plan, (newState, previousState) => {
  planManager = new PlanManager(newState)
  // planStates.value = planManager.simulate()
})

const showAdvancedOptions = ref<boolean>(false)

onMounted(async () => {
  await loadPlan();
})


</script>