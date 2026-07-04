<script lang="ts" setup>
import type {PlanInsert, PlanUpdate} from "#shared/types/Plan";

const planStore = usePlanStore()
const {results, pending, refresh} = usePlanSimulations()
const showModal = ref(false)

async function handleCreatePlan(insert: PlanInsert) {
  await planStore.create(insert)
  showModal.value = false
  await refresh()
}

function handleClickCreatePlan() {
  showModal.value = true
}

async function handleDeletePlan(id: number) {
  await planStore.purge(id)
  await refresh()
}

async function handleUpdatePlan(id: number, update: PlanUpdate) {
  await planStore.patch(id, update)
  await refresh()
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
    <PlanCreateForm
        @create="handleCreatePlan"
        @cancel="showModal = false"
    />
  </n-modal>

  <div v-if="pending && !results.length" class="plan-grid-skeleton">
    <n-card v-for="n in 3" :key="n" size="small">
      <n-skeleton text :repeat="2"/>
      <n-skeleton class="mt-3" height="130px" :sharp="false"/>
    </n-card>
  </div>
  <PlanList
      v-else
      :results="results"
      :loading="pending"
      @update="handleUpdatePlan"
      @delete="handleDeletePlan"
  />
</template>

<style scoped>
.plan-grid-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}
</style>