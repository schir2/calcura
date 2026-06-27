<script setup lang="ts">
import type {Plan, PlanUpdate} from "#shared/types/Plan"
import type {IncomeInsert} from "#shared/types/Income"
import type {ExpenseInsert} from "#shared/types/Expense"
import type {DebtInsert} from "#shared/types/Debt"
import type {CashReserveInsert} from "#shared/types/CashReserve"
import type {TaxDeferredInsert} from "#shared/types/TaxDeferred"
import type {BrokerageInsert} from "#shared/types/Brokerage"
import type {IraInsert} from "#shared/types/Ira"
import type {RothIraInsert} from "#shared/types/RothIra"
import type {HsaInsert} from "#shared/types/Hsa"
import type {ModelName} from "#shared/types/ModelName"
import type {OrchestratorState} from "#shared/types/OrchestratorState"
import type {Debt} from "#shared/types/Debt"
import type {Expense} from "#shared/types/Expense"

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

async function handleCreateModel(payload: {model: ModelName, data: unknown}) {
  const insert = {...(payload.data as object), plan_id: planId}
  switch (payload.model) {
    case 'income': await incomeStore.create(insert as IncomeInsert); break
    case 'expense': await expenseStore.create(insert as ExpenseInsert); break
    case 'debt': await debtStore.create(insert as DebtInsert); break
    case 'cash_reserve': await cashReserveStore.create(insert as CashReserveInsert); break
    case 'tax_deferred': await taxDeferredStore.create(insert as TaxDeferredInsert); break
    case 'brokerage': await brokerageStore.create(insert as BrokerageInsert); break
    case 'ira': await iraStore.create(insert as IraInsert); break
    case 'roth_ira': await rothIraStore.create(insert as RothIraInsert); break
    case 'hsa': await hsaStore.create(insert as HsaInsert); break
  }
}

async function handleUpdatePlan(plan: Partial<Plan>) {
  if (!plan.id) return
  const {id, ...update} = plan
  await planStore.patch(id, update as PlanUpdate)
}

async function handleDeletePlan(plan: Plan) {
  await planStore.purge(plan.id)
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

const activeExpensesAndDebts = computed((): {expenses: Expense[], debts: Debt[]} => {
  const result: {expenses: Expense[], debts: Debt[]} = {expenses: [], debts: []}
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
          <ChildCreateButtonList @create-model="handleCreateModel($event)"/>
        </n-card>
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