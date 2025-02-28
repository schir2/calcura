<template>
  <BrokerageInvestmentList :brokerageInvestments="brokerageInvestments"
               @create="handleCreateBrokerageInvestment"
               @update="handleUpdateBrokerageInvestment"
               @delete="handleDeleteBrokerageInvestment"
  ></BrokerageInvestmentList>
</template>
<script setup lang="ts">
import type {Brokerage, BrokerageInvestmentPartial} from "~/types/Brokerage";

import {useBrokerageService} from "~/composables/api/useBrokerageService";

const brokerageInvestmentService = useBrokerageService();


async function handleCreateBrokerageInvestment(brokerageInvestmentTemplate: BrokerageInvestmentPartial) {
  const brokerageInvestment = await brokerageInvestmentService.create(brokerageInvestmentTemplate)
  await loadBrokerageInvestments();
}

async function handleDeleteBrokerageInvestment(brokerageInvestment: Brokerage) {
  await brokerageInvestmentService.delete(brokerageInvestment.id)
  await loadBrokerageInvestments();
}

async function handleUpdateBrokerageInvestment(brokerageInvestment: Brokerage) {
  await brokerageInvestmentService.update(brokerageInvestment.id, brokerageInvestment)
  await loadBrokerageInvestments();
}

const brokerageInvestments = ref<Brokerage[]>([])
const loading = ref<boolean>(true);

async function loadBrokerageInvestments() {
  try {
    brokerageInvestments.value = await brokerageInvestmentService.list();
  } catch (error) {
    console.error('Error loading brokerageInvestments:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadBrokerageInvestments();
});
</script>
