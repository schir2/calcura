<script setup lang="ts">
import type {Plan} from "~/types/Plan";
import ChildCreateButtonList from "~/components/plan/ChildCreateButtonList.vue";
import {ModelName} from "~/types/ModelName";
import type {CommandSequence} from "~/types/CommandSequence";
import {camelToKebab} from "~/utils";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/types/PlanState";

const planService = usePlanService()
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

async function handleCreatePlanModel(payload: { model: ModelName, data: any }) {
  plan.value = await useApi(`plans/${planId}/${camelToKebab(payload.model)}s`).create(payload.data)
  await loadPlan()
}

async function handleRemovePlanModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(`plans/${planId}/${camelToKebab(modelName)}s`).remove(data.id)
  await loadPlan();
}

async function handleUpdateModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(`/${camelToKebab(modelName)}s`).update(data.id, data);
  await loadPlan();
}

async function handleDeleteModel(payload: { modelName: ModelName, data: any }) {
  const {modelName, data} = payload;
  await useApi(`/${camelToKebab(modelName)}s`).remove(payload.data.id);
  await loadPlan();
}

const repo = useRepo()

async function handleUpdateSequence(commandSequence: CommandSequence) {
  await repo.commandSequence.update(commandSequence.id, commandSequence)
  await loadPlan()
}

async function handleCreateSequence(commandSequence: CommandSequence) {
  await repo.commandSequence.create({name: 'Tester', plan: planId})
  await loadPlan()
}

async function handleDeleteSequence(commandSequenceId: number) {
  await repo.commandSequence.remove(commandSequenceId)
  await loadPlan()
}

const showModal = ref(false);
const showDataTable = ref<boolean>(false)

function handleClickShowMeTheDataButton() {
  showDataTable.value = true
}

async function handleUpdatePlan(planData: Plan) {
  await planService.update(planData.id, planData)
  showModal.value = false;
  await loadPlan()
}

function handleClose() {
  showModal.value = false;
}

const activeCommandSequenceId = ref<null | number>(null)

const planManager = ref<PlanManager | null>(null);
const planStates = ref<PlanState[] | null>(null);

watchEffect(() => {
  if (plan?.value) {
    planManager.value = new PlanManager(plan.value);
    if (!activeCommandSequenceId?.value) {
      activeCommandSequenceId.value = plan.value.commandSequences[0]?.id
    }
    planStates.value = planManager.value.simulate(activeCommandSequenceId.value)
  }
}, {})

provide('planStates', planStates)

async function loadPlan() {
  try {
    await refreshPlan()
    if (plan) {
    }
  } catch (error) {
    console.log('Error loading plan:', error);
  } finally {
    loading.value = false;
  }
}

const activeExpensesAndDebts = computed(() => {
      const result = {
        expenses: [],
        debts: []
      }
      if (activeCommandSequenceId?.value && planManager?.value) {
        const commands = planManager.value.getCommandsForSequence(activeCommandSequenceId.value)
        const currentPlan = planManager.value.getConfig() as Plan
        for (const command of commands) {
          if (command.isActive) {
            if (command.modelName === 'debt') {
              for (const debt of currentPlan.debts) {
                if (command.modelId === debt.id) {
                  result.debts.push(debt)
                }
              }
            } else if (command.modelName === 'expense') {
              for (const expense of currentPlan.expenses) {
                if (command.modelId === expense.id) {
                  result.expenses.push(expense)
                }
              }
            }
          }

        }
      }
      console.log(result)
      return result
    },
    {deep: true, immediate: true,})

</script>
<template>
  <div class="grid plan-container">
    <div v-if="plan" class="space-y-2" style="grid-area:main">
      <lazy-n-modal v-model:show="showModal">
        <LazyPlanForm :initialValues="plan" mode="edit"
                      @update="handleUpdatePlan"
                      @cancel="handleClose"
        />
      </lazy-n-modal>
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
            <lazy-n-modal
                class="max-w-[1800px] h-[720px]"
                v-model:show="showDataTable"
                :draggable="true"
                preset="card">
              <template #header>Plan Data</template>
              <LazyPlanTable v-if="plan && planStates" :planStates="planStates"/>
            </lazy-n-modal>
          </h3>
        </template>
        <ChildCreateButtonList @create-model="handleCreatePlanModel($event)"/>
      </n-card>

      <command-tabber
          v-if="plan"
          v-model:active-tab="activeCommandSequenceId"
          :plan="plan"
          @update="handleUpdateModel"
          @delete="handleDeleteModel"
          @remove="handleRemovePlanModel"
          @update-sequence="handleUpdateSequence"
          @delete-sequence="handleDeleteSequence"
          @create-sequence="handleCreateSequence"
      />
    </div>
    <div class="space-y-2" style="grid-area:charts">
      <div class="grid grid-cols-2 gap-2">
        <LazyChartExpensePie :expenses="activeExpensesAndDebts?.expenses" :debts="activeExpensesAndDebts?.debts"/>
        <span>Filler</span>
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