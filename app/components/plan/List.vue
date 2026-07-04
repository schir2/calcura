<script lang="ts" setup>
import type {PlanUpdate} from "#shared/types/Plan";
import type {SimulatedPlan} from "~/composables/usePlanSimulations";

type Props = {
  results: SimulatedPlan[]
  loading?: boolean
}
const {results = [], loading = false} = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, update: PlanUpdate]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleUpdate(id: number, update: PlanUpdate) {
  emit('update', id, update)
}
</script>

<template>
  <div class="plan-grid">
    <PlanCard
        v-for="result in results"
        :key="result.plan.id"
        :plan="result.plan"
        :projection="result.projection"
        :loading="loading"
        @delete="handleDelete"
        @update="handleUpdate"
    />
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