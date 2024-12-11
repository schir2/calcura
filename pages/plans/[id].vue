<template>
<!--  <ClientOnly>-->
<!--    <Teleport to="#right-side-bar">-->
<!--      &lt;!&ndash;      <PlanSummary :plan="plan"></PlanSummary>&ndash;&gt;-->
<!--    </Teleport>-->
<!--  </ClientOnly>-->
<!--  <ClientOnly>-->
<!--    <Teleport to="#left-side-bar">-->
<!--      <PlanProjection :planStates="planStates"></PlanProjection>-->
<!--    </Teleport>-->
<!--  </ClientOnly>-->
  <div v-if="plan" class="col-span-4 space-y-6">
    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Debt(s)</h2>
      </nav>
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
      ></IncomeList>
    </CommonCard>
    <CommonCard class="space-y-6 bg-skin-muted">

      <ExpenseList v-if="plan.expenses" :expenses="plan.expenses"
                  @createExpense="handleCreateExpense"
                  @updateExpense="handleUpdateExpense"
                  @deleteExpense="handleDeleteExpense"
      ></ExpenseList>
    </CommonCard>

<!--    &lt;!&ndash; Expenses &ndash;&gt;-->
<!--    <CommonCard class="space-y-6 bg-skin-muted">-->
<!--      <div class="flex align-middle gap-6">-->
<!--        <h2 class="text-3xl">Expenses</h2>-->
<!--        <NButton iconLeft="mdi:add" @click="handleAddExpense">Add Expense</NButton>-->
<!--      </div>-->
<!--      <CommonList>-->
<!--        <PlanExpense-->
<!--            v-for="(expense, index) in plan.expenses"-->
<!--            :key="index"-->
<!--            :expenseIndex="index"-->
<!--            :expense="expense"-->
<!--            @deleteExpense="handleDeleteExpense"-->
<!--        />-->
<!--      </CommonList>-->
<!--    </CommonCard>-->

<!--    &lt;!&ndash; Cash Maintenance &ndash;&gt;-->
<!--    <CommonCard class="bg-skin-muted space-y-6">-->
<!--      <nav class="flex align-middle gap-6">-->
<!--        <h2 class="text-3xl">Cash to Maintain</h2>-->
<!--      </nav>-->
<!--      <Cash-->
<!--          :cash="plan.cashes"-->
<!--          :showAdvancedOptions="showAdvancedOptions"-->
<!--      ></Cash>-->
<!--    </CommonCard>-->


<!--    <CommonCard class="bg-skin-muted space-y-6">-->
<!--      <nav class="flex align-middle gap-6">-->
<!--        <h2 class="text-3xl">Tax Deferred Investments</h2>-->
<!--        <NButton @click="handleAddTaxDeferredInvestment">Add Tax Deferred Investment</NButton>-->
<!--      </nav>-->
<!--      <CommonList>-->
<!--        <PlanTaxDeferredInvestment-->
<!--            v-for="(investment, index) in plan.taxDeferredInvestments"-->
<!--            :investment="investment"-->
<!--            :key="index"-->
<!--            :investmentIndex="index"-->
<!--            :showAdvancedOptions="showAdvancedOptions"-->
<!--            @deleteInvestment="handleDeleteTaxDeferredInvestment"-->
<!--        />-->
<!--      </CommonList>-->
<!--    </CommonCard>-->
<!--    <CommonCard class="bg-skin-muted space-y-6">-->
<!--      <nav class="flex align-middle gap-6">-->
<!--        <h2 class="text-3xl">Brokerage Investments</h2>-->
<!--        <NButton @click="handleAddBrokerageInvestment">Add Brokerage Investment</NButton>-->
<!--      </nav>-->
<!--      <CommonList>-->
<!--        <PlanBrokerageInvestment-->
<!--            v-for="(investment, index) in plan.brokerageInvestments"-->
<!--            :investment="investment"-->
<!--            :key="index"-->
<!--            :investmentIndex="index"-->
<!--            :showAdvancedOptions="showAdvancedOptions"-->
<!--            @deleteInvestment="handleDeleteBrokerageInvestment"-->
<!--        />-->
<!--      </CommonList>-->
<!--    </CommonCard>-->
  </div>
</template>
<script setup lang="ts">
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/models/plan/PlanState";
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type {Debt} from "~/models/debt/Debt";
import type {Expense} from "~/models/expense/Expense"
import type {Plan} from "~/models/plan/Plan";
import {defaultCashFactory} from "~/models/cash/CashFactories";
import type {Cash} from "~/models/cash/Cash";
import {defaultBrokerageInvestmentFactory} from "~/models/brokerage/BrokerageInvestmentFactories";
import {defaultIncomeFactory} from "~/models/income/IncomeFactories";
import {defaultExpenseFactory} from "~/models/expense/ExpenseFactories";

const planService = usePlanService()
const debtService = useDebtService()
const cashService = useCashService()
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
  await planService.addRelatedModel(planId, 'taxDeferredInvestment', debt.id)
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

async function handleCreateCash() {
  const cashConfig = defaultCashFactory();
  const cash = await cashService.create(cashConfig)
  await planService.addRelatedModel(planId, 'cashes', cash.id)
  await loadPlan();
}

async function handleDeleteCash(index: number) {
  await cashService.delete(index)
  await loadPlan();
}

async function handleUpdateCash(cash: Cash) {
  assertDefined(cash.id, 'cash.id')
  await cashService.update(cash.id, cash)
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
  await brokerageInvestmentService.create(brokerageInvestmentConfig)
  await planService.addRelatedModel(planId, 'brokerageInvestments', brokerageInvestment.id)
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
  await iraInvestmentService.create(iraInvestmentConfig)
  await planService.addRelatedModel(planId, 'iraInvestments', iraInvestment.id)
  await loadPlan();
}

async function handleDeleteIraInvestment(index: number) {
  await iraInvestmentService.delete(index)
  await loadPlan();
}

async function handleUpdateIraInvestment(iraInvestment: IraInvestment) {
  assertDefined(iraInvestment.id, 'iraInvestment.id')
  await iraInvestmentService.update(iraInvestment.id, iraInvestment)
  await loadPlan();
}

async function handleCreateTaxDeferredInvestment() {
  const taxDeferredInvestmentConfig = defaultTaxDeferredInvestmentFactory();
  await taxDeferredInvestmentService.create(taxDeferredInvestmentConfig)
  await planService.addRelatedModel(planId, 'taxDeferredInvestments', taxDeferredInvestment.id)
  await loadPlan();
}

async function handleDeleteTaxDeferredInvestment(index: number) {
  await taxDeferredInvestmentService.delete(index)
  await loadPlan();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  assertDefined(taxDeferredInvestment.id, 'taxDeferredInvestment.id')
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