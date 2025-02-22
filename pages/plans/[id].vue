<template>
<div class="grid grid-cols-3 gap-2">
  <div class="gap-2 col-span-2">
    <n-modal v-model:show="showModal">
      <PlanForm :initialValues="plan" mode="edit"
                @update="handleUpdate"
                @cancel="handleClose"
      />
    </n-modal>
    <PlanDetailCard :plan="plan" @update="handleUpdate"></PlanDetailCard>
    <section class="grid grid-cols-2 gap-2">
      <section class="space-y-3">
        <DebtList  :debts="plan.debts"
                  @create="handleCreateDebt"
                  @update="handleUpdateDebt"
                  @delete="handleDeleteDebt"
                  @remove="handleRemoveDebt"
        ></DebtList>


        <ExpenseList  :expenses="plan.expenses"
                     @create="handleCreateExpense"
                     @update="handleUpdateExpense"
                     @delete="handleDeleteExpense"
                     @remove="handleRemoveExpense"
        />
      </section>
      <section class="space-y-3">

        <IncomeList  :incomes="plan.incomes"
                    @create="handleCreateIncome"
                    @update="handleUpdateIncome"
                    @delete="handleDeleteIncome"
                    @remove="handleRemoveIncome"
        />
        <CashReserveList  :cashReserves="plan.cashReserves"
                         @create="handleCreateCashReserve"
                         @update="handleUpdateCashReserve"
                         @delete="handleDeleteCashReserve"
                         @remove="handleRemoveCashReserve"
        />


        <BrokerageInvestmentList  :brokerageInvestments="plan.brokerageInvestments"
                                 @create="handleCreateBrokerageInvestment"
                                 @update="handleUpdateBrokerageInvestment"
                                 @delete="handleDeleteBrokerageInvestment"
                                 @remove="handleRemoveBrokerageInvestment"
        />


        <IraInvestmentList  :iraInvestments="plan.iraInvestments"
                           @create="handleCreateIraInvestment"
                           @update="handleUpdateIraInvestment"
                           @delete="handleDeleteIraInvestment"
                           @remove="handleRemoveIraInvestment"
        />


        <RothIraInvestmentList  :rothIraInvestments="plan.rothIraInvestments" :plan="plan"
                               @create="handleCreateRothIraInvestment"
                               @update="handleUpdateRothIraInvestment"
                               @delete="handleDeleteRothIraInvestment"
                               @remove="handleRemoveRothIraInvestment"
        />


        <TaxDeferredInvestmentList
                                   :taxDeferredInvestments="plan.taxDeferredInvestments"
                                   :incomes="plan.incomes"
                                   @create="handleCreateTaxDeferredInvestment"
                                   @update="handleUpdateTaxDeferredInvestment"
                                   @delete="handleDeleteTaxDeferredInvestment"
                                   @remove="handleRemoveTaxDeferredInvestment"
        />
      </section>
    </section>

    <PlanTable v-if="plan && planStates" :planStates="planStates"/>
  </div>
    <div>
      <PlanChartGrowth :states="planStates"></PlanChartGrowth>
      <CommandSequence v-if="orderedCommands" :commands="orderedCommands" @update="handleCommandSequenceUpdate"></CommandSequence>
    </div>
</div>
</template>
<script setup lang="ts">
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/models/plan/PlanState";
import type {Debt, DebtPartial} from "~/models/debt/Debt";
import type {Expense, ExpensePartial} from "~/models/expense/Expense"
import type {Plan} from "~/models/plan/Plan";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import type {IraInvestment, IraInvestmentPartial} from "~/models/iraInvestment/IraInvestment";
import type {
  TaxDeferredInvestment,
  TaxDeferredInvestmentPartial
} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {Income, IncomePartial} from "~/models/income/Income";
import type {BrokerageInvestment, BrokerageInvestmentPartial} from "~/models/brokerageInvestment/BrokerageInvestment";
import type {RothIraInvestment, RothIraInvestmentPartial} from "~/models/rothIraInvestment/RothIraInvestment";
import eventBus from "~/services/eventBus";
import {type Command} from "~/types/Command";
import {compareAndSyncCommands} from "~/utils/commandUtils";

const planService = usePlanService()
const debtService = useDebtService()
const cashReserveService = useCashReserveService()
const expenseService = useExpenseService()
const incomeService = useIncomeService()
const iraInvestmentService = useIraInvestmentService()
const rothIraInvestmentService = useRothIraInvestmentService()
const brokerageInvestmentService = useBrokerageInvestmentService()
const taxDeferredInvestmentService = useTaxDeferredInvestmentService()
const route = useRoute()
const planId = Number(route.params.id)
const {data: plan, refresh: refreshPlan} = await useFetch<Plan>(`/api/plans/${planId}`)
const loading = ref<boolean>(false);
const orderedCommands = ref<Command[] | null>(null)

definePageMeta({
  layoutTransition: {name: 'slide-in'}
})


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
  await debtService.remove(debt.id)
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
  await cashReserveService.remove(cashReserve.id)
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

async function handleCreateIncome(incomePartial: IncomePartial) {
  const income = await incomeService.create(incomePartial)
  await planService.addRelatedModel(planId, 'incomes', income.id)
  await loadPlan();
}

async function handleDeleteIncome(income: Income) {
  await incomeService.remove(income.id)
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
  await expenseService.remove(expense.id)
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
  await brokerageInvestmentService.remove(brokerageInvestment.id)
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

async function handleCreateIraInvestment(iraInvestmentPartial: IraInvestmentPartial) {
  const iraInvestment = await iraInvestmentService.create(iraInvestmentPartial)
  await planService.addRelatedModel(planId, 'ira_investments', iraInvestment.id)
  await loadPlan();
}

async function handleDeleteIraInvestment(iraInvestment: IraInvestment) {
  await iraInvestmentService.remove(iraInvestment.id)
  await loadPlan();
}

async function handleUpdateIraInvestment(iraInvestment: IraInvestment) {
  await iraInvestmentService.update(iraInvestment.id, iraInvestment)
  await loadPlan();
}

async function handleRemoveIraInvestment(iraInvestment: IraInvestment) {
  await planService.removeRelatedModel(planId, 'ira_investments', iraInvestment.id)
  await loadPlan();
}

async function handleCreateRothIraInvestment(rothIraInvestmentPartial: RothIraInvestmentPartial) {
  const rothIraInvestment = await rothIraInvestmentService.create(rothIraInvestmentPartial)
  await planService.addRelatedModel(planId, 'roth_ira_investments', rothIraInvestment.id)
  await loadPlan();
}

async function handleDeleteRothIraInvestment(rothIraInvestment: RothIraInvestment) {
  await rothIraInvestmentService.remove(rothIraInvestment.id)
  await loadPlan();
}

async function handleUpdateRothIraInvestment(rothIraInvestment: RothIraInvestment) {
  await rothIraInvestmentService.update(rothIraInvestment.id, rothIraInvestment)
  await loadPlan();
}

async function handleRemoveRothIraInvestment(rothIraInvestment: RothIraInvestment) {
  await planService.removeRelatedModel(planId, 'roth_ira_investments', rothIraInvestment.id)
  await loadPlan();
}

async function handleCreateTaxDeferredInvestment(taxDeferredInvestmentPartial: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentPartial)
  await planService.addRelatedModel(planId, 'tax_deferred_investments', taxDeferredInvestment.id)
  await loadPlan();
}

async function handleDeleteTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.remove(taxDeferredInvestment.id)
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

async function handleCommandSequenceUpdate(commands: Command[]) {
  orderedCommands.value = commands
  planManager = new PlanManager(plan.value);
  planStates.value = planManager.simulate(orderedCommands.value)
}

const showModal = ref(false);

async function handleUpdate(planData: Plan) {
  await planService.update(planData.id, planData)
  showModal.value = false;
  await loadPlan()
}

function handleEdit() {
  showModal.value = true;
}

function handleClose() {
  showModal.value = false;
}

let planManager: PlanManager | null = null
const planStates = ref<PlanState[]>([])
const finalPlanState = ref<PlanState | null>(null)

async function loadPlan() {
  try {
    await refreshPlan
    planManager = new PlanManager(plan);
    const newCommands: Command[] = planManager.getCommands()
    if (!orderedCommands.value) {
      orderedCommands.value = newCommands

    } else {
      orderedCommands.value = compareAndSyncCommands(orderedCommands.value, newCommands)
    }
    planStates.value = planManager.simulate();
    finalPlanState.value = planStates.value[planStates.value.length - 1];
  } catch (error) {
    console.log('Error loading plan:', error);
  } finally {
    loading.value = false;
  }
}


</script>