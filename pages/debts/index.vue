<template>
  <DebtList :debts="debtConfigs"
            @createDebt="handleCreateDebt"
            @updateDebt="handleUpdateDebt"
            @deleteDebt="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type Debt from "~/models/debt/Debt";

import {useDebtService} from "~/composables/debtService";

const debtService = useDebtService();


async function handleCreateDebt() {
  const debtConfig = defaultDebtFactory();
  await debtService.create(debtConfig)
  await loadDebts();
}

async function handleDeleteDebt(index: number) {
  await debtService.delete(index)
  await loadDebts();
}

async function handleUpdateDebt(debtConfig: Debt) {
  await debtService.update(debtConfig.id, debtConfig)
  await loadDebts();
}

const {$api} = useNuxtApp()

const debtConfigs = ref<Debt[]>([])

async function loadDebts() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    debtConfigs.value = await debtService.list();
  } catch (error) {
    console.error('Error loading debts:', error);
  }
}

onMounted(async () => {
  await loadDebts();
});
</script>
