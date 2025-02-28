<template>
  <IraInvestmentList :iraInvestments="iraInvestments"
               @create="handleCreateIraInvestment"
               @update="handleUpdateIraInvestment"
               @delete="handleDeleteIraInvestment"
  ></IraInvestmentList>
</template>
<script setup lang="ts">
import type {Ira, IraPartial} from "~/types/Ira";

import {useIraService} from "~/composables/api/useIraService";

const iraInvestmentService = useIraService();


async function handleCreateIraInvestment(iraInvestmentTemplate: IraPartial) {
  const iraInvestment = await iraInvestmentService.create(iraInvestmentTemplate)
  await loadIraInvestments();
}

async function handleDeleteIraInvestment(iraInvestment: Ira) {
  await iraInvestmentService.remove(iraInvestment.id)
  await loadIraInvestments();
}

async function handleUpdateIraInvestment(iraInvestment: Ira) {
  await iraInvestmentService.update(iraInvestment.id, iraInvestment)
  await loadIraInvestments();
}

const iraInvestments = ref<Ira[]>([])
const loading = ref<boolean>(true);

async function loadIraInvestments() {
  try {
    iraInvestments.value = await iraInvestmentService.list();
  } catch (error) {
    console.error('Error loading iras:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadIraInvestments();
});
</script>
