<template>
  <DebtList :debts="debtConfigs"
            @createDebt="handleCreateDebt"
            @updateDebt="handleUpdateDebt"
            @deleteDebt="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type DebtConfig from "~/models/debt/DebtConfig";

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

async function handleUpdateDebt(debtConfig: DebtConfig) {
  await debtService.update(debtConfig.id, debtConfig)
  await loadDebts();
}

const debtConfigs = ref<DebtConfig[]>([])

async function loadDebts() {
  try {
    debtConfigs.value = await debtService.list();
  } catch (error) {
  }
}

onMounted(async () => {
  await loadDebts();
});
</script>
