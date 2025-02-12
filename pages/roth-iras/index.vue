<template>
  <RothIraInvestmentList :rothIraInvestments="rothIraInvestments"
               @create="handleCreateRothIraInvestment"
               @update="handleUpdateRothIraInvestment"
               @delete="handleDeleteRothIraInvestment"
  ></RothIraInvestmentList>
</template>
<script setup lang="ts">
import type {RothIraInvestment, RothIraInvestmentPartial} from "~/models/rothIraInvestment/RothIraInvestment";

import {useRothIraInvestmentService} from "~/composables/api/useRothIraInvestmentService";

const rothIraInvestmentService = useRothIraInvestmentService();


async function handleCreateRothIraInvestment(rothIraInvestmentTemplate: RothIraInvestmentPartial) {
  const rothIraInvestment = await rothIraInvestmentService.create(rothIraInvestmentTemplate)
  await loadRothIraInvestments();
}

async function handleDeleteRothIraInvestment(rothIraInvestment: RothIraInvestment) {
  await rothIraInvestmentService.delete(rothIraInvestment.id)
  await loadRothIraInvestments();
}

async function handleUpdateRothIraInvestment(rothIraInvestment: RothIraInvestment) {
  await rothIraInvestmentService.update(rothIraInvestment.id, rothIraInvestment)
  await loadRothIraInvestments();
}

const rothIraInvestments = ref<RothIraInvestment[]>([])
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
