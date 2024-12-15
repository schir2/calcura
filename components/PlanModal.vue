<template>
  <n-modal :show="showModal">
    <PlanForm :planPartial="planPartial" :mode="mode"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleCancel"/>
  </n-modal>

</template>
<script setup lang="ts">
import type {Plan} from "~/models/plan/Plan";

interface Props {
  planPartial: Partial<Plan>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const showModal = ref(false);

const emit = defineEmits(['update', 'close', 'create']);

function handleCreate(planPartial: Partial<Plan>) {
  emit('create', planPartial)

}

function handleUpdate(planPartial: Partial<Plan>) {
  console.log('update', planPartial)
  emit('update', planPartial)
}

function handleCancel() {
  emit('close')
}

onMounted(async () => {
  showModal.value = true;
})


</script>