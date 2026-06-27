<template>
  <IraInvestmentList :iraInvestments="iraStore.list"
               @create="handleCreateIraInvestment"
               @update="handleUpdateIraInvestment"
               @delete="handleDeleteIraInvestment"
  ></IraInvestmentList>
</template>
<script setup lang="ts">
import type {IraInsert, IraUpdate} from "#shared/types/Ira";

const iraStore = useIraStore()

onMounted(() => iraStore.fetchAll())

async function handleCreateIraInvestment(insert: IraInsert) {
  await iraStore.create(insert)
}

async function handleDeleteIraInvestment(id: number) {
  await iraStore.purge(id)
}

async function handleUpdateIraInvestment(id: number, update: IraUpdate) {
  await iraStore.patch(id, update)
}
</script>