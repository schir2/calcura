<template>
  <BrokerageList :brokerages="brokerageStore.list"
               @create="handleCreateBrokerageInvestment"
               @update="handleUpdateBrokerageInvestment"
               @delete="handleDeleteBrokerageInvestment"
  ></BrokerageList>
</template>
<script setup lang="ts">
import type {BrokerageInsert, BrokerageUpdate} from "#shared/types/Brokerage";

const brokerageStore = useBrokerageStore()

onMounted(() => brokerageStore.fetchAll())

async function handleCreateBrokerageInvestment(insert: BrokerageInsert) {
  await brokerageStore.create(insert)
}

async function handleDeleteBrokerageInvestment(id: number) {
  await brokerageStore.purge(id)
}

async function handleUpdateBrokerageInvestment(id: number, update: BrokerageUpdate) {
  await brokerageStore.patch(id, update)
}
</script>