<template>
  <div class="grid grid-cols-3 gap-2">
    <div v-if="plan" class="gap-2 col-span-2">
      <n-modal v-model:show="showModal">
        <PlanForm :initialValues="plan" mode="edit"
                  @update="handleUpdate"
                  @cancel="handleClose"
        />
      </n-modal>
      <PlanDetailCard :plan="plan" @update="handleUpdate"></PlanDetailCard>
      <nav>
        ...
      </nav>
      <section class="grid gap-2">
        <ChildCreateButtonList @create-model="handleCreatePlanModel($event)"/>
        <DebtListItem v-for="debt in plan.debts" :key="debt.id" :debt="debt"
                      @update="handleUpdateDebt"
                      @delete="handleDeleteDebt"
                      @remove="handleRemoveDebt"/>

        <ExpenseListItem v-for="expense in plan.expenses" :key="expense.id" :expense="expense"
                         @update="handleUpdateExpense"
                         @delete="handleDeleteExpense"
                         @remove="handleRemoveExpense"
        />

        <IncomeListItem v-for="income in plan.incomes" :key="income.id" :income="income"
                        @create="handleCreateIncome"
                        @update="handleUpdateIncome"
                        @delete="handleDeleteIncome"
                        @remove="handleRemoveIncome"
        />
        <CashReserveListItem v-for="cashReserve in plan.cashReserves" :key="cashReserve.id" :cashReserve="cashReserve"
                             @update="handleUpdateCashReserve"
                             @delete="handleDeleteCashReserve"
                             @remove="handleRemoveCashReserve"
        />


        <BrokerageListItem v-for="brokerage in plan.brokerages" :key="brokerage.id" :brokerage="brokerage"
                           @update="handleUpdateBrokerage"
                           @delete="handleDeleteBrokerage"
                           @remove="handleRemoveBrokerage"
        />


        <IraListItem v-for="ira in plan.iras" :key="ira.id" :ira="ira"
                     @update="handleUpdateIra"
                     @delete="handleDeleteIra"
                     @remove="handleRemoveIra"
        />


        <RothIraListItem v-for="rothIra in plan.rothIras" :key="rothIra.id" :rothIra="rothIra"
                         @update="handleUpdateRothIra"
                         @delete="handleDeleteRothIra"
                         @remove="handleRemoveRothIra"
        />


        <TaxDeferredListItem
            v-for="taxDeferred in plan.taxDeferreds"
            :key="taxDeferred.id"
            :taxDeferred="taxDeferred"
            :incomes="plan.incomes"
            @update="handleUpdateTaxDeferred"
            @delete="handleDeleteTaxDeferred"
            @remove="handleRemoveTaxDeferred"
        />
      </section>
    </div>
    <div>
      <PlanSimulation
          :plan="plan"
          v-for="commandSequence in plan.commandSequences"
          :key="commandSequence.id"
          :commandSequence="commandSequence"
          @update-command-sequence="handleCommandSequenceUpdate"
      ></PlanSimulation>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {Debt, DebtPartial} from "~/types/Debt";
import type {Expense, ExpensePartial} from "~/types/Expense"
import type {Plan} from "~/types/Plan";
import type {CashReserve} from "~/types/CashReserve";
import type {Ira, IraPartial} from "~/types/Ira";
import type {TaxDeferred, TaxDeferredPartial} from "~/types/TaxDeferred";
import type {Income, IncomePartial} from "~/types/Income";
import type {Brokerage, BrokeragePartial} from "~/types/Brokerage";
import type {RothIra, RothIraPartial} from "~/types/RothIra";
import ChildCreateButtonList from "~/components/plan/ChildCreateButtonList.vue";
import type {ModelName} from "~/types/ModelName";
import type {CommandSequence} from "~/types/CommandSequence";
import {toKebabCaseKey} from "~/utils";

const planService = usePlanService()
const debtService = useDebtService()
const cashReserveService = useCashReserveService()
const expenseService = useExpenseService()
const incomeService = useIncomeService()
const iraService = useIraService()
const rothIraService = useRothIraService()
const brokerageService = useBrokerageService()
const taxDeferredService = useTaxDeferredService()
const route = useRoute()
const planId = Number(route.params.id)
const {data: plan, refresh: refreshPlan, pending: planLoading} = await useFetch<Plan>(`/api/plans/${planId}`)
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

async function handleCreateBrokerage(brokeragePartial: BrokeragePartial) {
  const brokerage = await brokerageService.create(brokeragePartial)
  await planService.addRelatedModel(planId, 'brokerage_investments', brokerage.id)
  await loadPlan();
}

async function handleDeleteBrokerage(brokerage: Brokerage) {
  await brokerageService.remove(brokerage.id)
  await loadPlan();
}

async function handleUpdateBrokerage(brokerage: Brokerage) {
  await brokerageService.update(brokerage.id, brokerage)
  await loadPlan();
}

async function handleRemoveBrokerage(brokerage: Brokerage) {
  await planService.removeRelatedModel(planId, 'brokerage_investments', brokerage.id)
  await loadPlan();
}

async function handleCreateIra(iraPartial: IraPartial) {
  const ira = await iraService.create(iraPartial)
  await planService.addRelatedModel(planId, 'ira_investments', ira.id)
  await loadPlan();
}

async function handleDeleteIra(ira: Ira) {
  await iraService.remove(ira.id)
  await loadPlan();
}

async function handleUpdateIra(ira: Ira) {
  await iraService.update(ira.id, ira)
  await loadPlan();
}

async function handleRemoveIra(ira: Ira) {
  await planService.removeRelatedModel(planId, 'ira_investments', ira.id)
  await loadPlan();
}

async function handleCreateRothIra(rothIraPartial: RothIraPartial) {
  const rothIra = await rothIraService.create(rothIraPartial)
  await planService.addRelatedModel(planId, 'roth_ira_investments', rothIra.id)
  await loadPlan();
}

async function handleDeleteRothIra(rothIra: RothIra) {
  await rothIraService.remove(rothIra.id)
  await loadPlan();
}

async function handleUpdateRothIra(rothIra: RothIra) {
  await rothIraService.update(rothIra.id, rothIra)
  await loadPlan();
}

async function handleRemoveRothIra(rothIra: RothIra) {
  await planService.removeRelatedModel(planId, 'roth_ira_investments', rothIra.id)
  await loadPlan();
}

async function handleCreateTaxDeferred(taxDeferredPartial: TaxDeferredPartial) {
  const taxDeferred = await taxDeferredService.create(taxDeferredPartial)
  await planService.addRelatedModel(planId, 'tax_deferred_investments', taxDeferred.id)
  await loadPlan();
}

async function handleDeleteTaxDeferred(taxDeferred: TaxDeferred) {
  await taxDeferredService.remove(taxDeferred.id)
  await loadPlan();
}

async function handleUpdateTaxDeferred(taxDeferred: TaxDeferred) {
  await taxDeferredService.update(taxDeferred.id, taxDeferred)
  await loadPlan();
}

async function handleRemoveTaxDeferred(taxDeferredPartial: TaxDeferredPartial) {
  const taxDeferred = await taxDeferredService.create(taxDeferredPartial)
  await planService.removeRelatedModel(planId, 'tax_deferred_investments', taxDeferred.id)
  await loadPlan();
}

async function handleCreatePlanModel(payload: { model: ModelName, data: any }) {
  const p = await useApi<Expense>(`plans/${planId}/${toKebabCaseKey(payload.model)}s`).create(payload.data)
  await refreshPlan();

}

const repo = useRepo()

async function handleCommandSequenceUpdate(commandSequence: CommandSequence) {
  await repo.commandSequence.update(commandSequence.id, commandSequence)
  await refreshPlan()
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

async function loadPlan() {
  try {
    await refreshPlan()
  } catch (error) {
    console.log('Error loading plan:', error);
  } finally {
    loading.value = false;
  }
}


</script>