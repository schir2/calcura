<template>
  <PlanList :plans="planConfigs"
            @createPlan="handleCreatePlan"
            @updatePlan="handleUpdatePlan"
            @deletePlan="handleDeletePlan"
  ></PlanList>
</template>
<script lang="ts" setup>
import {usePlanService} from "~/composables/planService";

const planService = usePlanService()

import {defaultPlanFactory} from "~/models/plan/PlanFactories";
import type {PlanConfig} from "~/models/plan/PlanConfig";

async function handleCreatePlan() {
  const planConfig = defaultPlanFactory();
  await planService.create(planConfig)
  await loadPlans();
}

async function handleDeletePlan(index: number) {
  await planService.delete(index)
  await loadPlans();
}

async function handleUpdatePlan(planConfig: PlanConfig) {
  await planService.update(planConfig.id, planConfig)
  await loadPlans();
}

const planConfigs = ref<PlanConfig[]>([])

async function loadPlans() {
  try {
    planConfigs.value = await planService.list();
  } catch (error) {
  }
}

onMounted(async () => {
  await loadPlans();
});
</script>
