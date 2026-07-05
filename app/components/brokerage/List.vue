<template>
  <n-card title="Brokerages">
    <n-list>
      <BrokerageListItem v-for="brokerage in brokerages" :key="brokerage.id" :brokerage="brokerage"
                         @update="handleUpdate" @delete="handleDelete"/>
    </n-list>
  </n-card>
</template>
<script lang="ts" setup>
import type {Brokerage, BrokerageUpdate} from "#shared/types/Brokerage";

type Props = {
  brokerages: Brokerage[]
}

defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: BrokerageUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleUpdate(id: number, update: BrokerageUpdate) {
  emit('update', id, update)
}
</script>
