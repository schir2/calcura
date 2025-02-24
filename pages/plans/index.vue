<template>
  <n-button type="primary" circle @click="handleClickCreatePlan">
    <template #icon>
      <icon name="mdi:add"/>
    </template>
  </n-button>
  <n-modal v-model:show="showModal">
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
import type {Plan} from "~/types/Plan";
import {usePlanService} from "~/composables/api/usePlanService";


const planService = usePlanService()
const {data: plans, refresh: refreshPlans} = useFetch<Plan[]>('api/plans')

const showModal = ref(false)

async function handleCreatePlan(planTemplate: Partial<Plan>) {
  await planService.create(planTemplate)
  await refreshPlans();
}

function handleClickCreatePlan() {
  console.log("Create Plan")
  showModal.value = true
}

async function handleDeletePlan(plan: Plan) {
  await planService.remove(plan.id)
  await refreshPlans();
}

async function handleUpdatePlan(plan: Plan) {
  await planService.update(plan.id, plan)
  await refreshPlans();
}

onMounted(async () => {
  await refreshPlans();
});
</script>
