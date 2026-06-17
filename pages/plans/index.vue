<template>
  <n-button type="primary" circle @click="handleClickCreatePlan">
    <template #icon>
      <icon name="mdi:add"/>
    </template>
  </n-button>
  <n-modal
      v-model:show="showModal"
      class="max-w-6xl"
  >
    <template #header>
      <h3 class="text-2xl mb-2">
        <base-ico name="plan"/>
        Create New Plan
      </h3>
    </template>
    <plan-form
        @create="handleCreatePlan"
        @update="handleUpdatePlan"
        @cancel="showModal = false"
    />


  </n-modal>
  <PlanList :plans="plans"
            @duplicate="handleCreatePlan"
            @update="handleUpdatePlan"
            @delete="handleDeletePlan"
  ></PlanList>
</template>
<script lang="ts" setup>
import type {Plan, PlanInsert, PlanUpdate} from "~/types/Plan";
import {usePlanService} from "~/composables/api/usePlanService";
import {FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants";


const planService = usePlanService()
const {data: plans, refresh: refreshPlans} = useFetch<Plan[]>('api/plans')

const showModal = ref(false)

function toPlanInsert(plan: Partial<Plan>): PlanInsert {
    const {cash_reserves, incomes, expenses, debts, tax_deferreds, brokerages, iras, roth_iras, command_sequences, id, created_at, edited_at, ...scalar} = plan
    return scalar as PlanInsert
}

async function handleCreatePlan(planTemplate: Partial<Plan>) {
  await planService.create(toPlanInsert(planTemplate))
  await refreshPlans();
}

function handleClickCreatePlan() {
  showModal.value = true
}

async function handleDeletePlan(plan: Plan) {
  await planService.remove(plan.id)
  await refreshPlans();
}

async function handleUpdatePlan(plan: Plan) {
  const {id, ...update} = toPlanInsert(plan) as any
  await planService.update(plan.id, update as PlanUpdate)
  await refreshPlans();
}

onMounted(async () => {
  await refreshPlans();
});
</script>
