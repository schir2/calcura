<script lang="ts" setup>
import type {Plan, PlanUpdate} from "#shared/types/Plan";

type Props = {
  plans: Plan[]
}

const {plans = []} = defineProps<Props>()

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
    <PlanListItem v-for="(plan, index) in plans" :plan="plan" :key="plan.id"
                  @delete="handleDelete" @update="handleUpdate"></PlanListItem>

</template>