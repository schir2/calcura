<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">PlanConfig {{ planConfig.id }}: {{ currentPlanConfig.name }}</h3>
      <CommonButton iconLeft="mdi:delete" @click="deletePlan">Delete</CommonButton>
      <CommonButton v-if="isModified" iconLeft="mdi:history" @click="resetPlan">Reset</CommonButton>
      <CommonButton v-if="isModified" iconLeft="mdi:content-save" @click="updatePlan">Save</CommonButton>
    </div>
    <span>{{ planConfig.id }}</span>
    <span>{{ planConfig.name }}</span>
  </CommonCard>

</template>
<script setup lang="ts">

import type {PlanConfig} from "~/models/plan/PlanConfig";

interface Props {
  planConfig: PlanConfig
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, planConfig} = defineProps<Props>()

const emit = defineEmits(['deletePlan', 'updatePlan']);

function deletePlan() {
  assertDefined(planConfig.id, 'planId')
  emit('deletePlan', planConfig.id)
}

function updatePlan() {
  assertDefined(planConfig.id, 'planId')
  emit('updatePlan', planConfig)
}

const currentPlanConfig = reactive({...planConfig});
const isModified = computed(() =>
    JSON.stringify(currentPlanConfig) !== JSON.stringify(planConfig)
);

function resetPlan() {
  Object.assign(currentPlanConfig, {...planConfig});
}

</script>