<template>
  <BrokerageInvestmentList :brokerageInvestments="brokerageInvestmentConfigs"
            @createBrokerageInvestment="handleCreateBrokerageInvestment"
            @updateBrokerageInvestment="handleUpdateBrokerageInvestment"
            @deleteBrokerageInvestment="handleDeleteBrokerageInvestment"
  ></BrokerageInvestmentList>
</template>
<script setup lang="ts">
import {defaultBrokerageInvestmentFactory} from "~/models/brokerage/BrokerageInvestmentFactories";
import type {BrokerageInvestment} from "~/models/brokerage/BrokerageInvestment";

import {useBrokerageInvestmentService} from "~/composables/brokerageInvestmentService";

const brokerageInvestmentService = useBrokerageInvestmentService();


async function handleCreateBrokerageInvestment() {
  const brokerageInvestmentConfig = defaultBrokerageInvestmentFactory();
  await brokerageInvestmentService.create(brokerageInvestmentConfig)
  await loadBrokerageInvestments();
}

async function handleDeleteBrokerageInvestment(index: number) {
  await brokerageInvestmentService.delete(index)
  await loadBrokerageInvestments();
}

async function handleUpdateBrokerageInvestment(brokerageInvestment: BrokerageInvestment) {
  assertDefined(brokerageInvestment.id, 'brokerageInvestment.id');
  await brokerageInvestmentService.update(brokerageInvestment.id, brokerageInvestment)
  await loadBrokerageInvestments();
}

const {$api} = useNuxtApp()

const brokerageInvestmentConfigs = ref<BrokerageInvestment[]>([])

async function loadBrokerageInvestments() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    brokerageInvestmentConfigs.value = await brokerageInvestmentService.list();
  } catch (error) {
    console.error('Error loading brokerageInvestments:', error);
  }
}

onMounted(async () => {
  await loadBrokerageInvestments();
});
</script>
