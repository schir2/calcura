<script setup lang="ts">
import type {Plan} from "~/types/Plan";
import ChildCreateButtonList from "~/components/plan/ChildCreateButtonList.vue";
import {ModelName} from "~/types/ModelName";
import type {CommandSequence} from "~/types/CommandSequence";
import {toKebabCaseKey} from "~/utils";
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

async function handleRemovePlanModel(payload: { model: ModelName, id: number }) {
  await useApi(`plans/${planId}/${toKebabCaseKey(payload.model)}s`).remove(payload.id)
  await loadPlan();
}

async function handleCreatePlanModel(payload: { model: ModelName, data: any }) {
  plan.value = await useApi(`plans/${planId}/${toKebabCaseKey(payload.model)}s`).create(payload.data)
  await loadPlan()
}

async function handleUpdateModel(model: ModelName, item: any) {
  await useApi(`/${toKebabCaseKey(model)}s`).update(item.id, item);
  await loadPlan();
}

async function handleDeleteModel(model: ModelName, id: number) {
  await useApi(`/${toKebabCaseKey(model)}s`).remove(id);
  await loadPlan();
}

const repo = useRepo()

async function handleCommandSequenceUpdate(commandSequence: CommandSequence) {
  await repo.commandSequence.update(commandSequence.id, commandSequence)
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

const activeCommandSequence: CommandSequence | null = null

const planManager = ref<PlanManager | null>(null);
const planStates = ref<PlanState[] | null>(null);

watch(() => plan, (newPlan) => {
  if (newPlan.value) {
    planManager.value = new PlanManager(newPlan.value);
    if (activeCommandSequence && activeCommandSequence.value) {
      planStates.value = planManager.value.simulate()
    }
    planStates.value = planManager.value.simulate()
  }
}, {
  deep: true,
  immediate: true,
})

const finalPlanState = computed<PlanState | undefined>(() => {
  if (planStates.value) {
    return planStates.value[planStates.value.length - 1];
  }
})

provide('planStates', planStates)

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
<template>
  <div class="grid grid-cols-6 xl:grid-cols-6 gap-2">
    <div v-if="plan" class="gap-2 col-span-3 space-y-2">
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
            <span>Add Your Stuff</span></h3>
        </template>
        <ChildCreateButtonList @create-model="handleCreatePlanModel($event)"/>
      </n-card>

      <IncomeListItem v-for="income in plan.incomes" :key="income.id" :income="income"
                      @update="handleUpdateModel(ModelName.Income, $event)"
                      @delete="handleDeleteModel(ModelName.Income, $event.id)"
                      @remove="handleRemovePlanModel({...$event, model: ModelName.Income})"
      />

      <ExpenseListItem v-for="expense in plan.expenses" :key="expense.id" :expense="expense"
                       @update="handleUpdateModel(ModelName.Expense, $event)"
                       @delete="handleDeleteModel(ModelName.Expense, $event.id)"
                       @remove="handleRemovePlanModel({...$event, model: ModelName.Expense})"
      />

      <DebtListItem v-for="debt in plan.debts" :key="debt.id" :debt="debt"
                    @update="handleUpdateModel(ModelName.Debt, $event)"
                    @delete="handleDeleteModel(ModelName.Debt, $event.id)"
                    @remove="handleRemovePlanModel({...$event, model: ModelName.Debt})"/>

      <CashReserveListItem v-for="cashReserve in plan.cashReserves" :key="cashReserve.id" :cashReserve="cashReserve"
                           @update="handleUpdateModel(ModelName.CashReserve, $event)"
                           @delete="handleDeleteModel(ModelName.CashReserve, $event.id)"
                           @remove="handleRemovePlanModel({...$event, model: ModelName.CashReserve})"
      />


      <BrokerageListItem v-for="brokerage in plan.brokerages" :key="brokerage.id" :brokerage="brokerage"
                         @update="handleUpdateModel(ModelName.Brokerage, $event)"
                         @delete="handleDeleteModel(ModelName.Brokerage, $event.id)"
                         @remove="handleRemovePlanModel({...$event, model: ModelName.Brokerage})"
      />


      <IraListItem v-for="ira in plan.iras" :key="ira.id" :ira="ira"
                   @update="handleUpdateModel(ModelName.Ira, $event)"
                   @delete="handleDeleteModel(ModelName.Ira, $event.id)"
                   @remove="handleRemovePlanModel({...$event, model: ModelName.Ira})"
      />


      <RothIraListItem v-for="rothIra in plan.rothIras" :key="rothIra.id" :rothIra="rothIra"
                       @update="handleUpdateModel(ModelName.RothIra, $event)"
                       @delete="handleDeleteModel(ModelName.RothIra, $event.id)"
                       @remove="handleRemovePlanModel({...$event, model: ModelName.RothIra})"
      />


      <TaxDeferredListItem
          v-for="taxDeferred in plan.taxDeferreds"
          :key="taxDeferred.id"
          :taxDeferred="taxDeferred"
          @update="handleUpdateModel(ModelName.TaxDeferred, $event)"
          @delete="handleDeleteModel(ModelName.TaxDeferred, $event.id)"
          @remove="handleRemovePlanModel({...$event, model: ModelName.TaxDeferred})"
      />
    </div>
    <div class="col-span-3 space-y-2">
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
      <LazyChartExpensePie :expenses="plan?.expenses" :debts="plan?.debts"/>
      <LazyPlanChartGrowth v-if="planStates" :states="planStates"></LazyPlanChartGrowth>
      <CommandSequence v-if="activeCommandSequence"
                       :commandSequence="activeCommandSequence"
                       @update="handleCommandSequenceUpdate"
      ></CommandSequence>
    </div>
  </div>
</template>