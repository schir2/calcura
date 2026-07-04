<script lang="ts" setup>
import type {PlanInsert, PlanUpdate} from "#shared/types/Plan";

definePageMeta({
  title: 'Plans',
  layout: 'default',
  middleware: 'auth',
})

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
  <div class="max-w-6xl mx-auto px-4 space-y-8 py-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-4xl">Plans</h1>
        <p class="text-skin-muted text-lg">Compare your retirement scenarios side by side.</p>
      </div>
      <n-button type="primary" @click="handleClickCreatePlan">
        <template #icon>
          <icon name="mdi:add"/>
        </template>
        Create Plan
      </n-button>
    </header>

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

    <div v-if="pending && !results.length" class="plan-grid">
      <n-card v-for="n in 3" :key="n" size="small">
        <n-skeleton text :repeat="2"/>
        <n-skeleton class="mt-3" height="130px" :sharp="false"/>
      </n-card>
    </div>

    <p v-else-if="!results.length" class="text-skin-muted text-center py-16">
      No plans yet — create your first to see projections.
    </p>

    <div v-else class="plan-grid">
      <PlanCard
          v-for="result in results"
          :key="result.plan.id"
          :plan="result.plan"
          :projection="result.projection"
          :loading="pending"
          @update="handleUpdatePlan"
          @delete="handleDeletePlan"
      />
    </div>
  </div>
</template>

<style scoped>
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
  align-items: stretch;
}
</style>