<template>
  <CommonButton @click="handleAddDebt()">Add</CommonButton>
  <div class="container">
    <PlanDebt v-for="(debtConfig, index) in debtConfigs" :debtConfig="debtConfig" :key="debtConfig.id" @deleteDebt="handleDeleteDebt" @updateDebt="handleUpdateDebt"></PlanDebt>
  </div>
</template>
<script setup lang="ts">
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type DebtConfig from "~/models/debt/DebtConfig";

import {debtService} from "~/services/debtService";


async function handleAddDebt() {
  const debtConfig = defaultDebtFactory();
  await debtService.create(debtConfig)
  await loadDebts();
}

async function handleDeleteDebt(index: number) {
  await debtService.delete(index)
  await loadDebts();
}

async function handleUpdateDebt(debtConfig: DebtConfig) {
  console.log(debtConfig)
  await debtService.update(debtConfig.id, debtConfig)
  await loadDebts();
}

const debtConfigs = ref<DebtConfig[]>([])

async function loadDebts() {
  try {
    debtConfigs.value = await debtService.fetchList();
  } catch (error) {
    console.error('Failed to load debts:', error);
  }
}

onMounted(async () => {
  await loadDebts();
});
</script>
