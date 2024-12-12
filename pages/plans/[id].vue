<template>
    <ClientOnly>
      <Teleport to="#right-side-bar">
              <PlanSummary v-if="plan" :plan="plan"></PlanSummary>
      </Teleport>
    </ClientOnly>
<!--    <ClientOnly>-->
  <!--    <Teleport to="#left-side-bar">-->
  <!--      <PlanProjection :planStates="planStates"></PlanProjection>-->
  <!--    </Teleport>-->
  <!--  </ClientOnly>-->
  <div v-if="plan" class="col-span-4 space-y-6">
    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <DebtList v-if="plan.debts" :debts="plan.debts"
                @createDebt="handleCreateDebt"
                @updateDebt="handleUpdateDebt"
                @deleteDebt="handleDeleteDebt"
      ></DebtList>
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">
      <IncomeList v-if="plan.incomes" :incomes="plan.incomes"
                  @createIncome="handleCreateIncome"
                  @updateIncome="handleUpdateIncome"
                  @deleteIncome="handleDeleteIncome"
      />
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">

      <ExpenseList v-if="plan.expenses" :expenses="plan.expenses"
                   @createExpense="handleCreateExpense"
                   @updateExpense="handleUpdateExpense"
                   @deleteExpense="handleDeleteExpense"
      />
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">

      <CashReserveList v-if="plan.cashReserves" :cashReserves="plan.cashReserves"
                @createCashReserve="handleCreateCashReserve"
                @updateCashReserve="handleUpdateCashReserve"
                @deleteCashReserve="handleDeleteCashReserve"
      />
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">

      <BrokerageInvestmentList v-if="plan.brokerageInvestments" :brokerageInvestments="plan.brokerageInvestments"
                               @createBrokerageInvestment="handleCreateBrokerageInvestment"
                               @updateBrokerageInvestment="handleUpdateBrokerageInvestment"
                               @deleteBrokerageInvestment="handleDeleteBrokerageInvestment"
      />
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">

      <IraInvestmentList v-if="plan.iraInvestments" :iraInvestments="plan.iraInvestments"
                         @createIraInvestment="handleCreateIraInvestment"
                         @updateIraInvestment="handleUpdateIraInvestment"
                         @deleteIraInvestment="handleDeleteIraInvestment"
      />
    </CommonCard>
  </div>
</template>
<script setup lang="ts">
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/models/plan/PlanState";
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type {Debt} from "~/models/debt/Debt";
import type {Expense} from "~/models/expense/Expense"
import type {Plan} from "~/models/plan/Plan";
import {defaultCashReserveFactory} from "~/models/cashReserve/CashReserveFactories";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import {defaultBrokerageInvestmentFactory} from "~/models/brokerageInvestment/BrokerageInvestmentFactories";
import {defaultIncomeFactory} from "~/models/income/IncomeFactories";
import {defaultExpenseFactory} from "~/models/expense/ExpenseFactories";
import {defaultTaxDeferredInvestmentFactory} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentFactories";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {defaultIraInvestmentFactory} from "~/models/iraInvestment/IraInvestmentFactories";

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

async function handleCreateDebt() {
  const debtConfig = defaultDebtFactory();
  const debt = await debtService.create(debtConfig)
  await planService.addRelatedModel(planId, 'debts', debt.id)
  await loadPlan();
}

async function handleDeleteDebt(index: number) {
  await debtService.delete(index)
  await loadPlan();
}

async function handleUpdateDebt(debt: Debt) {
  assertDefined(debt.id, 'debt.id')
  await debtService.update(debt.id, debt)
  await loadPlan();
}

async function handleCreateCashReserve() {
  const cashReserveConfig = defaultCashReserveFactory();
  const cashReserve = await cashReserveService.create(cashReserveConfig)
  await planService.addRelatedModel(planId, 'cash_reserves', cashReserve.id)
  await loadPlan();
}

async function handleDeleteCashReserve(index: number) {
  console.log(index)
  await cashReserveService.delete(index)
  await loadPlan();
}

async function handleUpdateCashReserve(cashReserve: CashReserve) {
  assertDefined(cashReserve.id, 'cashReserve.id')
  await cashReserveService.update(cashReserve.id, cashReserve)
  await loadPlan();
}

async function handleCreateExpense() {
  const expenseConfig = defaultExpenseFactory();
  const expense = await expenseService.create(expenseConfig)
  await planService.addRelatedModel(planId, 'expenses', expense.id)
  await loadPlan();
}

async function handleDeleteExpense(index: number) {
  await expenseService.delete(index)
  await loadPlan();
}

async function handleUpdateExpense(expense: Expense) {
  assertDefined(expense.id, 'expense.id')
  await expenseService.update(expense.id, expense)
  await loadPlan();
}

async function handleCreateIncome() {
  const incomeConfig = defaultIncomeFactory();
  const income = await incomeService.create(incomeConfig)
  await planService.addRelatedModel(planId, 'incomes', income.id)
  await loadPlan();
}

async function handleDeleteIncome(index: number) {
  await incomeService.delete(index)
  await loadPlan();
}

async function handleUpdateIncome(income: Income) {
  assertDefined(income.id, 'income.id')
  await incomeService.update(income.id, income)
  await loadPlan();
}

async function handleCreateBrokerageInvestment() {
  const brokerageInvestmentConfig = defaultBrokerageInvestmentFactory();
  const brokerageInvestment = await brokerageInvestmentService.create(brokerageInvestmentConfig)
  await planService.addRelatedModel(planId, 'brokerage_investments', brokerageInvestment.id)
  await loadPlan();
}

async function handleDeleteBrokerageInvestment(index: number) {
  await brokerageInvestmentService.delete(index)
  await loadPlan();
}

async function handleUpdateBrokerageInvestment(brokerageInvestment: BrokerageInvestment) {
  assertDefined(brokerageInvestment.id, 'brokerageInvestment.id')
  await brokerageInvestmentService.update(brokerageInvestment.id, brokerageInvestment)
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

async function handleCreateTaxDeferredInvestment() {
  const taxDeferredInvestmentConfig = defaultTaxDeferredInvestmentFactory();
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentConfig)
  await planService.addRelatedModel(planId, 'tax_deferred_investments', taxDeferredInvestment.id)
  await loadPlan();
}

async function handleDeleteTaxDeferredInvestment(index: number) {
  await taxDeferredInvestmentService.delete(index)
  await loadPlan();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
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
  planStates.value = planManager.simulate()
})

const showAdvancedOptions = ref<boolean>(false)

onMounted(async () => {
  await loadPlan();
})


</script>