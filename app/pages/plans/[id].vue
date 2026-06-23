<script setup lang="ts">
import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import ChildCreateButtonList from "~/components/plan/ChildCreateButtonList.vue";
import type {ModelName} from "#shared/types/ModelName";
import type {CommandSequence} from "#shared/types/CommandSequence";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "#shared/types/PlanState";
import type {Debt} from "#shared/types/Debt";
import type {Expense} from "#shared/types/Expense";

const planService = usePlanService()
const supabase = useSupabaseClient()

const route = useRoute()
const planId = Number(route.params.id)


const {data: plan, refresh: refreshPlan, status} = useAsyncData(() => {
  return supabase.from('plan').
  select(
      `*, cash_reserves:cash_reserve(*), income(*), expenses:expense(*), debts:debt(*), tax_deffereds:tax_deferred(*), brokerages:brokerage(*), iras:ira(*), roth_iras:roth_ira(*), command_sequences:command_sequence(*, command_sequence_commands:command_sequence_command(*, command(*)))`).
  eq('id', planId).single()
})
const loading = ref<boolean>(false);


definePageMeta({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

async function handleCreatePlanModel(payload: { model: ModelName, data: any }) {
  console.log(payload)
  switch (payload.model) {
    case 'income':
  }
  plan.value = await planService.create(payload.data)
  await refreshPlan()
}

async function handleRemovePlanModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(modelName).remove(data.id)
  await refreshPlan();
}

async function handleUpdateModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(modelName).update(data.id, data);
  await refreshPlan();
}

async function handleDeleteModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(modelName).remove(payload.data.id);
  await refreshPlan();
}

const repo = useRepo()

async function handleUpdateSequence(commandSequence: CommandSequence) {
  await repo.commandSequence.update(commandSequence.id, commandSequence)
  await refreshPlan()
}

async function handleCreateSequence(commandSequence: CommandSequence) {
  await repo.commandSequence.create({name: 'Tester', plan: planId})
  await refreshPlan()
}

async function handleDeleteSequence(commandSequenceId: number) {
  await repo.commandSequence.remove(commandSequenceId)
  await refreshPlan()
}

const showModal = ref(false);
const showDataTable = ref<boolean>(false)

function handleClickShowMeTheDataButton() {
  showDataTable.value = true
}

async function handleUpdatePlan(id: number, update: PlanUpdate) {
  await planService.update(id, update)
  showModal.value = false;
  await refreshPlan()
}

function handleClose() {
  showModal.value = false;
}

const activeCommandSequenceId = ref<null | number>(null)

const planManager = ref<PlanManager | null>(null);
const planStates = ref<PlanState[] | null>(null);

// watchEffect(() => {
//   if (plan?.value) {
//     planManager.value = new PlanManager(plan.value);
//     if (!activeCommandSequenceId?.value) {
//       activeCommandSequenceId.value = plan.value.commandSequences[0]?.id
//     }
//     planStates.value = planManager.value.simulate(activeCommandSequenceId.value)
//   }
// }, {})

provide('planStates', planStates)

const activeExpensesAndDebts = computed((): { expenses: Expense[], debts: Debt[] } => {
      const result: { expenses: Expense[], debts: Debt[] } = {
        expenses: [],
        debts: []
      }
      if (activeCommandSequenceId?.value && planManager?.value) {
        const commands = planManager.value.getCommandsForSequence(activeCommandSequenceId.value)
        const currentPlan = planManager.value.getConfig() as Plan
        for (const command of commands) {
          if (command.is_active) {
            if (command.model_name === 'debt') {
              for (const debt of currentPlan.debts) {
                if (command.model_id === debt.id) {
                  result.debts.push(debt)
                }
              }
            } else if (command.model_name === 'expense') {
              for (const expense of currentPlan.expenses) {
                if (command.model_id === expense.id) {
                  result.expenses.push(expense)
                }
              }
            }
          }

        }
      }
      return result
    },
    {deep: true, immediate: true,})

</script>
<template>
  <div class="grid plan-container">
    {{plan}}
    <div v-if="plan" class="space-y-2" style="grid-area:main">
      <n-modal v-model:show="showModal">
        <LazyPlanForm :initialValues="plan" mode="edit"
                      @update="handleUpdatePlan"
                      @cancel="handleClose"
        />
      </n-modal>
      <PlanDetailCard :plan="plan" @update="handleUpdatePlan"></PlanDetailCard>
      <n-card>
        <template #header>
          <h3 class="text-xl flex items-center gap-2">
            <base-ico class="text-skin-success" name="create"/>
            <span>Add Your Stuff</span>
            <n-button type="primary" @click="handleClickShowMeTheDataButton">
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
              <LazyPlanTable v-if="plan && planStates" :planStates="planStates"/>
            </n-modal>
          </h3>
        </template>
        <ChildCreateButtonList @create-model="handleCreatePlanModel($event)"/>
      </n-card>

<!--      <command-tabber-->
<!--          v-if="plan?.command_sequences"-->
<!--          v-model:active-tab="activeCommandSequenceId"-->
<!--          :plan="plan"-->
<!--          @update="handleUpdateModel"-->
<!--          @delete="handleDeleteModel"-->
<!--          @remove="handleRemovePlanModel"-->
<!--          @update-sequence="handleUpdateSequence"-->
<!--          @delete-sequence="handleDeleteSequence"-->
<!--          @create-sequence="handleCreateSequence"-->
<!--      />-->
    </div>
    <div class="space-y-2" style="grid-area:charts">
      <div class="grid grid-cols-2 gap-2">
        <LazyChartExpensePie :expenses="activeExpensesAndDebts?.expenses" :debts="activeExpensesAndDebts?.debts"/>
        <LazyPlanChartGrossSavings v-if="planStates" :states="planStates"></LazyPlanChartGrossSavings>
        <LazyPlanChartGrowth v-if="planStates" :states="planStates"></LazyPlanChartGrowth>
        <LazyPlanChartExpensesOverTime v-if="planStates" :states="planStates"/>
      </div>
    </div>
  </div>
</template>
<style scoped>
.plan-container {
  gap: .5rem;
  display: grid;
  grid-template-columns:3fr 3fr;
  grid-template-areas: 'main charts'
}
</style>