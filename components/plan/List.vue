<template>
  <CommonButton @click="handleCreatePlan()">Add</CommonButton>
  <div class="container">
    <Plan v-for="(planConfig, index) in plans" :planConfig="planConfig" :key="planConfig.id"
          @deletePlan="handleDeletePlan" @updatePlan="handleUpdatePlan"></Plan>
  </div>

</template>
<script lang="ts" setup>
import type {PlanConfig} from "~/models/plan/PlanConfig";

interface Props {
  plans: PlanConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deletePlan', 'updatePlan', 'createPlan']);

function handleDeletePlan(planId: number) {
  emit('deletePlan', planId);
}

function handleCreatePlan() {
  emit('createPlan');
}

function handleUpdatePlan(planConfig: PlanConfig) {
  emit('updatePlan', planConfig);
}

</script>