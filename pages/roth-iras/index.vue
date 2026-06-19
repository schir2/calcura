<template>
  <RothIraInvestmentList :rothIraInvestments="rothIraInvestments"
               @create="handleCreateRothIraInvestment"
               @update="handleUpdateRothIraInvestment"
               @delete="handleDeleteRothIraInvestment"
  ></RothIraInvestmentList>
</template>
<script setup lang="ts">
import type {RothIra, RothIraInsert, RothIraUpdate} from "~/types/RothIra";

import {useRothIraService} from "~/composables/api/useRothIraService";

const rothIraInvestmentService = useRothIraService();


async function handleCreateRothIraInvestment(insert: RothIraInsert) {
  await rothIraInvestmentService.create(insert)
  await loadRothIraInvestments();
}

async function handleDeleteRothIraInvestment(id: number) {
  await rothIraInvestmentService.remove(id)
  await loadRothIraInvestments();
}

async function handleUpdateRothIraInvestment(id: number, update: RothIraUpdate) {
  await rothIraInvestmentService.update(id, update)
  await loadRothIraInvestments();
}

const rothIraInvestments = ref<RothIra[]>([])
const loading = ref<boolean>(true);

async function loadRothIraInvestments() {
  try {
    rothIraInvestments.value = await rothIraInvestmentService.list();
  } catch (error) {
    console.error('Error loading rothIraInvestments:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadRothIraInvestments();
});
</script>
