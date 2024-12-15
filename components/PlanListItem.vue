<template>
  <PlanModal
      v-if="isModalOpen && plan"
      :planPartial="plan"
      @create="handleCreate"
      @update="handleUpdate"
      @close="handleClose"
      mode="edit"
  />
  <n-thing>
    <template #header>
      <NuxtLink :to="{name: 'plans-id', params: {id: plan.id}}"><h3 class="text-2xl">Plan {{ plan.id }}:
        {{ plan.name }}</h3></NuxtLink>
    </template>
    <template #header-extra>
      <n-button-group size="small">
        <n-button type="warning" secondary round @click="isModalOpen = true">
          <template #icon>
            <Icon name="mdi:edit"/>
          </template>
          Edit
        </n-button>
        <n-button type="error" secondary round @click="handleDelete">
          <template #icon>
            <Icon name="mdi:delete"/>
          </template>
          Delete
        </n-button>
      </n-button-group>
    </template>
    <div class="grid grid-cols-6">
      <span>ID: {{ plan.id }}</span>
      <span>Age: {{ plan.age }}</span>
      <span>Year: {{ plan.year }}</span>
      <span>Life Expectancy: {{ plan.lifeExpectancy }}</span>
      <span>Tax Rate: {{ plan.taxRate }}</span>
      <span>Strategy: {{ plan.retirementStrategy }}</span>
      <span>Retirement Age: {{ plan.retirementAge }}</span>
    </div>
  </n-thing>

</template>
<script setup lang="ts">

import type {Plan} from "~/models/plan/Plan";

interface Props {
  plan: Plan
}

const props = defineProps<Props>()

const isModalOpen = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create']);

function handleDelete(plan: Plan) {
  emit('delete', props.plan);
}

function handleUpdate(plan: Partial<Plan>) {
  emit('update', plan)
}


function handleCreate(plan: Partial<Plan>) {
  emit('create', plan)
}

function handleClose() {
  isModalOpen.value = false
}
</script>