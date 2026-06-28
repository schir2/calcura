<script setup lang="ts">
import type {PlanUpdate} from "#shared/types/Plan"
import type {IncomeInsert, IncomeUpdate} from "#shared/types/Income"
import type {Expense, ExpenseInsert, ExpenseUpdate} from "#shared/types/Expense"
import type {Debt, DebtInsert, DebtUpdate} from "#shared/types/Debt"
import type {CashReserveInsert, CashReserveUpdate} from "#shared/types/CashReserve"
import type {TaxDeferredInsert, TaxDeferredUpdate} from "#shared/types/TaxDeferred"
import type {BrokerageInsert, BrokerageUpdate} from "#shared/types/Brokerage"
import type {IraInsert, IraUpdate} from "#shared/types/Ira"
import type {RothIraInsert, RothIraUpdate} from "#shared/types/RothIra"
import type {HsaInsert, HsaUpdate} from "#shared/types/Hsa"
import type {ModelName} from "#shared/types/ModelName"
import type {OrchestratorState} from "#shared/types/OrchestratorState"

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const planId = Number(route.params.id)

const orchestrator = orchestratorStore()
const planStore = usePlanStore()
const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()
const debtStore = useDebtStore()
const cashReserveStore = useCashReserveStore()
const taxDeferredStore = useTaxDeferredStore()
const brokerageStore = useBrokerageStore()
const iraStore = useIraStore()
const rothIraStore = useRothIraStore()
const hsaStore = useHsaStore()
const commandSequenceStore = useCommandSequenceStore()

onMounted(() => orchestrator.load(planId))

async function handleCreateModel(payload: { model: ModelName, data: unknown }) {
  const insert = payload.data
  switch (payload.model) {
    case 'income':
      await incomeStore.create(insert as IncomeInsert);
      break
    case 'expense':
      await expenseStore.create(insert as ExpenseInsert);
      break
    case 'debt':
      await debtStore.create(insert as DebtInsert);
      break
    case 'cash_reserve':
      await cashReserveStore.create(insert as CashReserveInsert);
      break
    case 'tax_deferred':
      await taxDeferredStore.create(insert as TaxDeferredInsert);
      break
    case 'brokerage':
      await brokerageStore.create(insert as BrokerageInsert);
      break
    case 'ira':
      await iraStore.create(insert as IraInsert);
      break
    case 'roth_ira':
      await rothIraStore.create(insert as RothIraInsert);
      break
    case 'hsa':
      await hsaStore.create(insert as HsaInsert);
      break
  }
  await commandSequenceStore.fetchByPlan(planId)
}

async function handleUpdateModel(payload: { modelName: ModelName, id: number, data: Record<string, unknown> }) {
  const {modelName, id, data} = payload
  switch (modelName) {
    case 'income':
      await incomeStore.patch(id, data as IncomeUpdate);
      break
    case 'expense':
      await expenseStore.patch(id, data as ExpenseUpdate);
      break
    case 'debt':
      await debtStore.patch(id, data as DebtUpdate);
      break
    case 'cash_reserve':
      await cashReserveStore.patch(id, data as CashReserveUpdate);
      break
    case 'tax_deferred':
      await taxDeferredStore.patch(id, data as TaxDeferredUpdate);
      break
    case 'brokerage':
      await brokerageStore.patch(id, data as BrokerageUpdate);
      break
    case 'ira':
      await iraStore.patch(id, data as IraUpdate);
      break
    case 'roth_ira':
      await rothIraStore.patch(id, data as RothIraUpdate);
      break
    case 'hsa':
      await hsaStore.patch(id, data as HsaUpdate);
      break
  }
}

async function handleDeleteModel(payload: { modelName: ModelName, id: number }) {
  const {modelName, id} = payload
  switch (modelName) {
    case 'income':
      await incomeStore.purge(id);
      break
    case 'expense':
      await expenseStore.purge(id);
      break
    case 'debt':
      await debtStore.purge(id);
      break
    case 'cash_reserve':
      await cashReserveStore.purge(id);
      break
    case 'tax_deferred':
      await taxDeferredStore.purge(id);
      break
    case 'brokerage':
      await brokerageStore.purge(id);
      break
    case 'ira':
      await iraStore.purge(id);
      break
    case 'roth_ira':
      await rothIraStore.purge(id);
      break
    case 'hsa':
      await hsaStore.purge(id);
      break
  }
  await commandSequenceStore.fetchByPlan(planId)
}

async function handleDeleteSequence(id: number) {
  await commandSequenceStore.purge(id)
}

async function handleCreateSequence() {
  const seq = await commandSequenceStore.create({ plan_id: planId, name: 'New Sequence' })
  await commandSequenceStore.fetch(seq.id)
}

async function handleUpdatePlan(id: number, update: PlanUpdate) {
  await planStore.patch(id, update)
  await orchestrator.reloadPlan(id)
}

async function handleDeletePlan(id: number) {
  await planStore.purge(id)
  await navigateTo('/plans')
}

const activeCommandSequenceId = ref<number | null>(null)
const planStates = ref<OrchestratorState[] | null>(null)
const showDataTable = ref<boolean>(false)

watchEffect(() => {
  if (!orchestrator.loaded) return
  const sequences = commandSequenceStore.list
  if (!activeCommandSequenceId.value && sequences.length > 0) {
    activeCommandSequenceId.value = sequences[0]!.id
  }
  const commandSequence = activeCommandSequenceId.value
      ? commandSequenceStore.get(activeCommandSequenceId.value)
      : undefined
  planStates.value = orchestrator.simulate(commandSequence!) ?? null
})

provide('planStates', planStates)

const activeExpensesAndDebts = computed((): { expenses: Expense[], debts: Debt[] } => {
  const result: { expenses: Expense[], debts: Debt[] } = {expenses: [], debts: []}
  const plan = orchestrator.planWithRelations
  if (!activeCommandSequenceId.value || !plan) return result
  const commandSequence = commandSequenceStore.get(activeCommandSequenceId.value)
  if (!commandSequence) return result
  for (const csc of commandSequence.command_sequence_commands) {
    if (!csc.is_active) continue
    if (csc.command.model_name === 'debt') {
      const debt = plan.debts.find(d => d.id === csc.command.model_id)
      if (debt) result.debts.push(debt)
    } else if (csc.command.model_name === 'expense') {
      const expense = plan.expenses.find(e => e.id === csc.command.model_id)
      if (expense) result.expenses.push(expense)
    }
  }
  return result
})
</script>

<template>
  <div class="grid plan-container">
    <n-spin :show="!orchestrator.loaded" style="grid-area:main">
      <div v-if="orchestrator.planWithRelations" class="space-y-2">
        <PlanDetailCard
            :plan="orchestrator.planWithRelations"
            @update="handleUpdatePlan"
            @delete="handleDeletePlan"
        />
        <n-card>
          <template #header>
            <h3 class="text-xl flex items-center gap-2">
              <base-ico class="text-skin-success" name="create"/>
              <span>Add Your Stuff</span>
              <n-button type="primary" @click="showDataTable = true">
                <template #icon>
                  <base-ico name="table"/>
                </template>
                Show Me the Data
              </n-button>
              <n-modal
                  class="max-w-[1800px] h-[720px]"
                  v-model:show="showDataTable"
                  :draggable="true"
                  preset="card">
                <template #header>Plan Data</template>
                <LazyPlanTable v-if="orchestrator.planWithRelations && planStates" :planStates="planStates"/>
              </n-modal>
            </h3>
          </template>
          <PlanChildCreateButtonList :plan_id="planId" @create-model="handleCreateModel($event)"/>
        </n-card>
        <command-tabber
            :command_sequences="commandSequenceStore.list"
            :plan="orchestrator.planWithRelations"
            v-model="activeCommandSequenceId"
            @update="handleUpdateModel"
            @delete="handleDeleteModel"
            @delete-sequence="handleDeleteSequence"
            @create-sequence="handleCreateSequence"
        />
      </div>
    </n-spin>
    <div class="space-y-2" style="grid-area:charts">
      <div class="grid grid-cols-2 gap-2">
        <LazyChartExpensePie :expenses="activeExpensesAndDebts.expenses" :debts="activeExpensesAndDebts.debts"/>
        <LazyPlanChartGrossSavings v-if="planStates" :states="planStates"/>
        <LazyPlanChartGrowth v-if="planStates" :states="planStates"/>
        <LazyPlanChartExpensesOverTime v-if="planStates" :states="planStates"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plan-container {
  gap: .5rem;
  display: grid;
  grid-template-columns: 3fr 3fr;
  grid-template-areas: 'main charts'
}
</style>