<template>

  <n-modal v-model:show="showModal">
    <PlanUpdateForm :id="plan.id"
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
        <n-popconfirm v-model:show="showDeletePopConfirm">
          <template #icon>
            <Icon class="text-6xl text-skin-error" name="mdi:delete"/>
          </template>
          <template #action>
            <n-button tertiary round @click="showDeletePopConfirm=false">Cancel</n-button>
            <n-button tertiary type="error" round @click="handleDelete">
              <template #icon><Icon name="mdi:delete"/></template>
              Delete
            </n-button>
          </template>
          <template #trigger>
            <n-button type="error" secondary round>
              <template #icon>
                <Icon name="mdi:delete"/>
              </template>
              Delete
            </n-button>
          </template>
          <div class="max-w-md px-3 pe-3">
            <h2 class="text-xl my-3 text-skin-error font-semibold">Delete Plan</h2>
            <p>Are you sure you want to delete this plan?</p>
            <p class="text-skin-info text-xs mb-2">This will permanently remove the plan and all associated data.</p>
          </div>
        </n-popconfirm>
      </n-button-group>
    </template>
    <div class="grid grid-cols-6">
      <span>ID: {{ plan.id }}</span>
      <span>Age: {{ plan.age }}</span>
      <span>Year: {{ plan.year }}</span>
      <span>Life Expectancy: {{ plan.life_expectancy }}</span>
      <span>Tax Rate: {{ plan.tax_rate }}</span>
      <span>Strategy: {{ plan.retirement_strategy }}</span>
      <span>Retirement Age: {{ plan.retirement_age }}</span>
    </div>
  </n-card>

</template>
<script setup lang="ts">

import type {Plan, PlanUpdate} from "#shared/types/Plan";

type Props = {
  plan: Plan
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)
const showDeletePopConfirm = ref<boolean>(false)

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, update: PlanUpdate]
}>()

function handleDelete() {
  showDeletePopConfirm.value = false
  emit('delete', props.plan.id)
}

function handleUpdate(id: number, update: PlanUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>