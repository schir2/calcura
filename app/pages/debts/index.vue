<template>
  <DebtList :debts="debts"
               @create="handleCreateDebt"
               @update="handleUpdateDebt"
               @delete="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import type {Debt, DebtInsert, DebtUpdate} from "#shared/types/Debt";

import {useDebtService} from "~/composables/api/useDebtService";

const debtService = useDebtService();


async function handleCreateDebt(insert: DebtInsert) {
  await debtService.create(insert)
  await loadDebts();
}

async function handleDeleteDebt(id: number) {
  await debtService.remove(id)
  await loadDebts();
}

async function handleUpdateDebt(id: number, update: DebtUpdate) {
  await debtService.update(id, update)
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
