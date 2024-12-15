<template>
  <DebtList v-if="debts" :debts="debts"
            @createDebt="handleCreateDebt"
            @updateDebt="handleUpdateDebt"
            @deleteDebt="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type {Debt} from "~/models/debt/Debt";

import {useDebtService} from "~/composables/api/useDebtService";

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

async function handleUpdateDebt(debt: Debt) {
  assertDefined(debt.id, 'debt.id');
  await debtService.update(debt.id, debt)
  await loadDebts();
}

const {$api} = useNuxtApp()

const debts = ref<Debt[]>([])

async function loadDebts() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    debts.value = await debtService.list();
  } catch (error) {
    console.error('Error loading debts:', error);
  }
}

onMounted(async () => {
  await loadDebts();
});
</script>
