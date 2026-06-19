<template>
  <IraInvestmentList :iraInvestments="iraInvestments"
               @create="handleCreateIraInvestment"
               @update="handleUpdateIraInvestment"
               @delete="handleDeleteIraInvestment"
  ></IraInvestmentList>
</template>
<script setup lang="ts">
import type {Ira, IraInsert, IraUpdate} from "~/types/Ira";

import {useIraService} from "~/composables/api/useIraService";

const iraInvestmentService = useIraService();


async function handleCreateIraInvestment(insert: IraInsert) {
  await iraInvestmentService.create(insert)
  await loadIraInvestments();
}

async function handleDeleteIraInvestment(id: number) {
  await iraInvestmentService.remove(id)
  await loadIraInvestments();
}

async function handleUpdateIraInvestment(id: number, update: IraUpdate) {
  await iraInvestmentService.update(id, update)
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
