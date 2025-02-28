<template>
  <n-card title="Brokerages">
      <BrokerageListItem v-for="(brokerage, index) in brokerages" :brokerage="brokerage" :key="brokerage.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></BrokerageListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {Brokerage, BrokerageTemplate} from "~/types/Brokerage";

interface Props {
  brokerages: Brokerage[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(brokerage: Brokerage) {
  emit('delete', brokerage);
}

function handleCreate(brokerageTemplate: BrokerageTemplate) {
  emit('create', brokerageTemplate);
}

function handleUpdate(brokerage: Brokerage) {
  emit('update', brokerage);
}

function handleRemove(brokerage: Brokerage) {
  emit('remove', brokerage)
}

</script>