<template>
  <main>
    <PlanListItem v-for="(plan, index) in plans" :plan="plan" :key="plan.id"
                  @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></PlanListItem>
  </main>

</template>
<script lang="ts" setup>
import type {Plan} from "~/models/plan/Plan";

interface Props {
  plans: Plan[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create']);

function handleDelete(plan: Plan) {
  emit('delete', plan);
}
function handleUpdate(plan: Partial<Plan>) {
  console.log(plan)
  emit('update', plan);
}
function handleCreate(plan: Partial<Plan>) {
  emit('create', plan);
}

</script>