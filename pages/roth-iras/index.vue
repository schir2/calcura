<template>
  <RothIraInvestmentList :rothIraInvestments="rothIraInvestments"
               @create="handleCreateRothIraInvestment"
               @update="handleUpdateRothIraInvestment"
               @delete="handleDeleteRothIraInvestment"
  ></RothIraInvestmentList>
</template>
<script setup lang="ts">
import type {RothIra, RothIraInvestmentPartial} from "~/types/RothIra";

import {useRothIraService} from "~/composables/api/useRothIraService";

const rothIraInvestmentService = useRothIraService();


async function handleCreateRothIraInvestment(rothIraInvestmentTemplate: RothIraInvestmentPartial) {
  const rothIraInvestment = await rothIraInvestmentService.create(rothIraInvestmentTemplate)
  await loadRothIraInvestments();
}

async function handleDeleteRothIraInvestment(rothIraInvestment: RothIra) {
  await rothIraInvestmentService.delete(rothIraInvestment.id)
  await loadRothIraInvestments();
}

async function handleUpdateRothIraInvestment(rothIraInvestment: RothIra) {
  await rothIraInvestmentService.update(rothIraInvestment.id, rothIraInvestment)
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
