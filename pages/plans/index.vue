<template>
  <PlanTemplatePicker @save="handleCreatePlan "/>
  <PlanList :plans="plans"
            @createPlan="handleCreatePlan"
            @updatePlan="handleUpdatePlan"
            @deletePlan="handleDeletePlan"
  ></PlanList>
</template>
<script lang="ts" setup>
import {usePlanService} from "~/composables/planService";
import type {Plan} from "~/models/plan/Plan";
import type {PlanTemplate} from "~/models/plan/PlanTemplate";
import PlanTemplatePicker from "~/components/PlanTemplatePicker.vue";

const planService = usePlanService()

async function handleCreatePlan(planTemplate: PlanTemplate) {
  await planService.create(planTemplate)
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
