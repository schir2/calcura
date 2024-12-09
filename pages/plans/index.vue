<template>
  <PlanList :plans="plans"
            @createPlan="handleCreatePlan"
            @updatePlan="handleUpdatePlan"
            @deletePlan="handleDeletePlan"
  ></PlanList>
</template>
<script lang="ts" setup>
import {usePlanService} from "~/composables/planService";

const planService = usePlanService()

import {defaultPlanFactory} from "~/models/plan/PlanFactories";
import type {Plan} from "~/models/plan/Plan";

async function handleCreatePlan() {
  const planConfig = defaultPlanFactory();
  await planService.create(planConfig)
  await loadPlans();
}

async function handleDeletePlan(index: number) {
  await planService.delete(index)
  await loadPlans();
}

async function handleUpdatePlan(plan: Plan) {
  await planService.update(plan.id, plan)
  await loadPlans();
}

const plans = ref<Plan[]>([])

async function loadPlans() {
  try {
    plans.value = await planService.list();
  } catch (error) {
  }
}

onMounted(async () => {
  await loadPlans();
});
</script>
