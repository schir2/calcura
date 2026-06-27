<script lang="ts" setup>
import type {PlanInsert, PlanUpdate} from "#shared/types/Plan";

const planStore = usePlanStore()
const showModal = ref(false)

onMounted(() => planStore.fetchAll())

async function handleCreatePlan(insert: PlanInsert) {
  await planStore.create(insert)
  showModal.value = false
}

function handleClickCreatePlan() {
  showModal.value = true
}

async function handleDeletePlan(id: number) {
  await planStore.purge(id)
}

async function handleUpdatePlan(id: number, update: PlanUpdate) {
  await planStore.patch(id, update)
}
</script>

<template>
  <n-button type="primary" circle @click="handleClickCreatePlan">
    <template #icon>
      <icon name="mdi:add"/>
    </template>
  </n-button>
  <n-modal
      v-model:show="showModal"
      class="max-w-6xl"
  >
    <template #header>
      <h3 class="text-2xl mb-2">
        <base-ico name="plan"/>
        Create New Plan
      </h3>
    </template>
    <plan-form
        @create="handleCreatePlan"
        @update="handleUpdatePlan"
        @cancel="showModal = false"
    />
  </n-modal>
  <PlanList
      :plans="planStore.list"
      @duplicate="handleCreatePlan"
      @update="handleUpdatePlan"
      @delete="handleDeletePlan"
  ></PlanList>
</template>