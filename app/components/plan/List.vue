<script lang="ts" setup>
import type {Plan, PlanInsert, PlanUpdate} from "#shared/types/Plan";

type Props = {
  plans: Plan[]
}

const {plans = []} = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, update: PlanUpdate]
  duplicate: [insert: PlanInsert]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleUpdate(id: number, update: PlanUpdate) {
  emit('update', id, update)
}

function handleCreate(insert: PlanInsert) {
  emit('duplicate', insert)
}

</script>
<template>
    <PlanListItem v-for="(plan, index) in plans" :plan="plan" :key="plan.id"
                  @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></PlanListItem>

</template>