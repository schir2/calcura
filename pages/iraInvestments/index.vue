<template>
  <IraInvestmentList :iraInvestments="iraInvestmentConfigs"
            @createIraInvestment="handleCreateIraInvestment"
            @updateIraInvestment="handleUpdateIraInvestment"
            @deleteIraInvestment="handleDeleteIraInvestment"
  ></IraInvestmentList>
</template>
<script setup lang="ts">
import {defaultIraInvestmentFactory} from "~/models/iraInvestment/IraInvestmentFactories";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";

const iraInvestmentService = useIraInvestmentService();


async function handleCreateIraInvestment() {
  const iraInvestmentConfig = defaultIraInvestmentFactory();
  await iraInvestmentService.create(iraInvestmentConfig)
  await loadIraInvestments();
}

async function handleDeleteIraInvestment(index: number) {
  await iraInvestmentService.delete(index)
  await loadIraInvestments();
}

async function handleUpdateIraInvestment(iraInvestmentConfig: IraInvestment) {
  await iraInvestmentService.update(iraInvestmentConfig.id, iraInvestmentConfig)
  await loadIraInvestments();
}

const {$api} = useNuxtApp()

const iraInvestmentConfigs = ref<IraInvestment[]>([])

async function loadIraInvestments() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    iraInvestmentConfigs.value = await iraInvestmentService.list();
  } catch (error) {
    console.error('Error loading iraInvestments:', error);
  }
}

onMounted(async () => {
  await loadIraInvestments();
});
</script>
