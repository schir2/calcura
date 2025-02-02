<template>

  <n-modal v-model:show="showModal">
    <PlanForm :initialValues="plan" mode="edit"
              @delete="handleDelete"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleClose"
    />
  </n-modal>
  <n-card>
    <template #header>
      <NuxtLink :to="{name: 'plans-id', params: {id: plan.id}}"><h3 class="text-2xl">Plan {{ plan.id }}:
        {{ plan.name }}</h3></NuxtLink>
    </template>
    <template #header-extra>
      <n-button-group size="small">
        <n-button type="warning" secondary round @click="handleEdit">
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
  </n-card>

</template>
<script setup lang="ts">

import type {Plan} from "~/models/plan/Plan";

interface Props {
  plan: Plan
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create']);

function handleDelete() {
  emit('delete', props.plan);
}

function handleUpdate(plan: Partial<Plan>) {
  emit('update', plan)
  showModal.value = false;
}


function handleCreate(planPartial: Partial<Plan>) {
  emit('create', planPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>