<template>
  <PlanTemplatePicker @create="handleCreatePlan "/>
  <PlanList :plans="plans"
            @duplicate="handleCreatePlan"
            @update="handleUpdatePlan"
            @delete="handleDeletePlan"
  ></PlanList>
</template>
<script lang="ts" setup>
import {usePlanService} from "~/composables/api/usePlanService";
import type {Plan, PlanPartial} from "~/models/plan/Plan";

const planService = usePlanService()

async function handleCreatePlan(planTemplate: PlanPartial) {
  await planService.create(planTemplate)
  await loadPlans();
}

async function handleDeletePlan(plan: Plan) {
  await planService.remove(plan.id)
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
