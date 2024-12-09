<template>
  <NListItem color="secondary">
    <div class="flex justify-between align-middle">
      <NuxtLink :to="{name: 'plans-id', params: {id: planConfig.id}}"><h3 class="text-2xl">Plan {{ planConfig.id }}: {{ currentPlanConfig.name }}</h3></NuxtLink>
      <NButton type="error" secondary @click="deletePlan">
        <Icon name="mdi:delete"/>
        Delete
      </NButton>
    </div>
    <span>{{ planConfig.id }}</span>
    <span>{{ planConfig.name }}</span>
  </NListItem>

</template>
<script setup lang="ts">

import type {Plan} from "~/models/plan/Plan";

interface Props {
  planConfig: Plan
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