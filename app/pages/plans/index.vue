<script lang="ts" setup>
definePageMeta({
  title: 'Plans',
  layout: 'default',
  middleware: 'auth',
})

const planStore = usePlanStore()
const {results, pending, refresh} = usePlanSimulations()
const {duplicatePlan} = useDuplicatePlan()

async function handleDuplicatePlan(id: number) {
  await duplicatePlan(id)
  await refresh()
}

async function handleDeletePlan(id: number) {
  await planStore.purge(id)
  await refresh()
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 space-y-8 py-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-display">Plans</h1>
        <p class="text-skin-muted text-lg">Compare your retirement scenarios side by side.</p>
      </div>
      <n-button type="primary" @click="navigateTo('/plans/new')">
        <template #icon>
          <icon name="mdi:add"/>
        </template>
        Create Plan
      </n-button>
    </header>

    <div v-if="pending && !results.length" class="plan-grid">
      <n-card v-for="n in 3" :key="n" size="small">
        <n-skeleton text :repeat="2"/>
        <n-skeleton class="mt-3" height="130px" :sharp="false"/>
      </n-card>
    </div>

    <div v-else-if="!results.length" class="text-center py-16 space-y-4">
      <p class="text-skin-muted">No plans yet — create your first to see projections.</p>
      <n-button type="primary" @click="navigateTo('/plans/new')">Create your first plan</n-button>
    </div>

    <div v-else class="plan-grid">
      <PlanCard
          v-for="result in results"
          :key="result.plan.id"
          :plan="result.plan"
          :projection="result.projection"
          :loading="pending"
          @duplicate="handleDuplicatePlan"
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