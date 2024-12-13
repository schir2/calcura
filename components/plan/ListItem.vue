<template>
  <n-thing color="secondary">
    <template #header>
      <NuxtLink :to="{name: 'plans-id', params: {id: planConfig.id}}"><h3 class="text-2xl">Plan {{ planConfig.id }}:
        {{ currentPlanConfig.name }}</h3></NuxtLink>
    </template>
    <template #header-extra>
      <n-button-group size="small">
        <n-button type="warning" secondary round @click="handleUpdatePlan"><template #icon><Icon name="mdi:edit"/></template>Edit</n-button>
        <n-button type="error" secondary round @click="deletePlan"><template #icon><Icon name="mdi:delete"/></template>Delete</n-button>
      </n-button-group>
    </template>
    <div class="flex justify-between align-middle">
    </div>
    <span>{{ planConfig.id }}</span>
    <span>{{ planConfig.name }}</span>
  </n-thing>

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