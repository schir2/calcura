<template>
  <DebtList :debts="debts"
               @create="handleCreateDebt"
               @update="handleUpdateDebt"
               @delete="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import type {Debt, DebtPartial} from "~/types/Debt";

import {useDebtService} from "~/composables/api/useDebtService";

const debtService = useDebtService();


async function handleCreateDebt(debtTemplate: DebtPartial) {
  const debt = await debtService.create(debtTemplate)
  await loadDebts();
}

async function handleDeleteDebt(debt: Debt) {
  await debtService.delete(debt.id)
  await loadDebts();
}

async function handleUpdateDebt(debt: Debt) {
  await debtService.update(debt.id, debt)
  await loadDebts();
}

const debts = ref<Debt[]>([])
const loading = ref<boolean>(true);

async function loadDebts() {
  try {
    debts.value = await debtService.list();
  } catch (error) {
    console.error('Error loading debts:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadDebts();
});
</script>
