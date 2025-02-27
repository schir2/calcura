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
        <ChildCreateButtonList @create-model="handleCreateModel($event)" />
          <DebtListItem v-for="debt in plan.debts" :key="debt.id" :debt="debt"
                    @update="handleUpdateDebt"
                    @delete="handleDeleteDebt"
                    @remove="handleRemoveDebt" />
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


          <BrokerageInvestmentListItem v-for="brokerageInvestment in plan.brokerageInvestments" :key="brokerageInvestment.id" :brokerageInvestment="brokerageInvestment"
                                   @update="handleUpdateBrokerageInvestment"
                                   @delete="handleDeleteBrokerageInvestment"
                                   @remove="handleRemoveBrokerageInvestment"
          />


          <IraInvestmentListItem v-for="iraInvestment in plan.iraInvestments" :key="iraInvestment.id" :iraInvestment="iraInvestment"
                             @update="handleUpdateIraInvestment"
                             @delete="handleDeleteIraInvestment"
                             @remove="handleRemoveIraInvestment"
          />


          <RothIraInvestmentListItem v-for="rothIraInvestment in plan.rothIraInvestments" :key="rothIraInvestment.id" :rothIraInvestment="rothIraInvestment"
                                 @update="handleUpdateRothIraInvestment"
                                 @delete="handleDeleteRothIraInvestment"
                                 @remove="handleRemoveRothIraInvestment"
          />


          <TaxDeferredInvestmentListItem
              v-for="taxDeferredInvestment in plan.taxDeferredInvestments"
              :key="taxDeferredInvestment.id"
              :taxDeferredInvestment="taxDeferredInvestment"
              :incomes="plan.incomes"
              @update="handleUpdateTaxDeferredInvestment"
              @delete="handleDeleteTaxDeferredInvestment"
              @remove="handleRemoveTaxDeferredInvestment"
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
import type {IraInvestment, IraInvestmentPartial} from "~/types/IraInvestment";
import type {
  TaxDeferredInvestment,
  TaxDeferredInvestmentPartial
} from "~/types/TaxDeferredInvestment";
import type {Income, IncomePartial} from "~/types/Income";
import type {BrokerageInvestment, BrokerageInvestmentPartial} from "~/types/BrokerageInvestment";
import type {RothIraInvestment, RothIraInvestmentPartial} from "~/types/RothIraInvestment";
import {type Command} from "~/types/Command";
import ChildCreateButtonList from "~/components/plan/ChildCreateButtonList.vue";
import type {ModelName} from "~/types/ModelName";
import type {CommandSequence} from "~/types/CommandSequence";

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

const repo = useRepo()
async function handleCreateModel(payload: {model: ModelName, data: any}){
  if (!repo[payload.model]) {
    throw new Error(`Model ${payload.model} does not exist in the repository.`);
  }
  const relatedModel = await repo[payload.model].create(payload.data)
  console.log(toSnakeCase(payload.model))
  await repo.plan.addRelatedModel( planId, `${toSnakeCase(payload.model)}s`, relatedModel.id,)
  await refreshPlan();

}

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