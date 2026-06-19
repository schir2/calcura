<template>
  <n-card title="Brokerages">
      <BrokerageListItem v-for="(brokerage, index) in brokerages" :brokerage="brokerage" :key="brokerage.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></BrokerageListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {Brokerage, BrokerageInsert, BrokerageUpdate} from "~/types/Brokerage";

type Props = {
  brokerages: Brokerage[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: BrokerageInsert]
  update: [id: number, update: BrokerageUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: BrokerageInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: BrokerageUpdate) {
  emit('update', id, update)
}

</script>