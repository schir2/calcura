<template>
  <BrokerageInvestmentList :brokerageInvestments="brokerageInvestments"
               @create="handleCreateBrokerageInvestment"
               @update="handleUpdateBrokerageInvestment"
               @delete="handleDeleteBrokerageInvestment"
  ></BrokerageInvestmentList>
</template>
<script setup lang="ts">
import type {Brokerage, BrokerageInsert, BrokerageUpdate} from "#shared/types/Brokerage";

import {useBrokerageService} from "~/composables/api/useBrokerageService";

const brokerageInvestmentService = useBrokerageService();


async function handleCreateBrokerageInvestment(insert: BrokerageInsert) {
  await brokerageInvestmentService.create(insert)
  await loadBrokerageInvestments();
}

async function handleDeleteBrokerageInvestment(id: number) {
  await brokerageInvestmentService.remove(id)
  await loadBrokerageInvestments();
}

async function handleUpdateBrokerageInvestment(id: number, update: BrokerageUpdate) {
  await brokerageInvestmentService.update(id, update)
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
