<template>
  <NButton @click="handleCreatePlan()">Add</NButton>
  <NList class="container">
    <PlanListItem v-for="(planConfig, index) in plans" :planConfig="planConfig" :key="planConfig.id"
          @deletePlan="handleDeletePlan" @updatePlan="handleUpdatePlan"></PlanListItem>
  </NList>

</template>
<script lang="ts" setup>
import type {Plan} from "~/models/plan/Plan";

interface Props {
  plans: Plan[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deletePlan', 'updatePlan', 'createPlan']);

function handleDeletePlan(planId: number) {
  emit('deletePlan', planId);
}

function handleCreatePlan() {
  emit('createPlan');
}

function handleUpdatePlan(planConfig: Plan) {
  emit('updatePlan', planConfig);
}

</script>