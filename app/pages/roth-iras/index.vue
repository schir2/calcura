<template>
  <RothIraList :rothIras="rothIraStore.list"
               @create="handleCreateRothIraInvestment"
               @update="handleUpdateRothIraInvestment"
               @delete="handleDeleteRothIraInvestment"
  ></RothIraList>
</template>
<script setup lang="ts">
import type {RothIraInsert, RothIraUpdate} from "#shared/types/RothIra";

const rothIraStore = useRothIraStore()

onMounted(() => rothIraStore.fetchAll())

async function handleCreateRothIraInvestment(insert: RothIraInsert) {
  await rothIraStore.create(insert)
}

async function handleDeleteRothIraInvestment(id: number) {
  await rothIraStore.purge(id)
}

async function handleUpdateRothIraInvestment(id: number, update: RothIraUpdate) {
  await rothIraStore.patch(id, update)
}
</script>