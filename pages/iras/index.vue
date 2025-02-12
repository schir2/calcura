<template>
  <IraInvestmentList :iraInvestments="iraInvestments"
               @create="handleCreateIraInvestment"
               @update="handleUpdateIraInvestment"
               @delete="handleDeleteIraInvestment"
  ></IraInvestmentList>
</template>
<script setup lang="ts">
import type {IraInvestment, IraInvestmentPartial} from "~/models/iraInvestment/IraInvestment";

import {useIraInvestmentService} from "~/composables/api/useIraInvestmentService";

const iraInvestmentService = useIraInvestmentService();


async function handleCreateIraInvestment(iraInvestmentTemplate: IraInvestmentPartial) {
  const iraInvestment = await iraInvestmentService.create(iraInvestmentTemplate)
  await loadIraInvestments();
}

async function handleDeleteIraInvestment(iraInvestment: IraInvestment) {
  await iraInvestmentService.delete(iraInvestment.id)
  await loadIraInvestments();
}

async function handleUpdateIraInvestment(iraInvestment: IraInvestment) {
  await iraInvestmentService.update(iraInvestment.id, iraInvestment)
  await loadIraInvestments();
}

const iraInvestments = ref<IraInvestment[]>([])
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
