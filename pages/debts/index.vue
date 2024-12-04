<template>
  <CommonButton @click="handleAddDebt()">Add</CommonButton>
  <div class="container">
    <PlanDebt v-for="(debtConfig, index) in debtConfigs" :debt="debtConfig" :key="debtConfig.id" @deleteDebt="handleDeleteDebt"/>
  </div>
</template>
<script setup lang="ts">
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type DebtConfig from "~/models/debt/DebtConfig";
import {dbService} from "~/services/dbService";

async function handleAddDebt() {
  const debtConfig = defaultDebtFactory();
  await loadDebts();
}

async function handleDeleteDebt(index: number) {
  await dbService.table('debts').delete(index)
  await loadDebts();
}

const debtConfigs = ref<DebtConfig[]>([])

async function loadDebts() {
  try {
    debtConfigs.value = await dbService.table('debts').toArray();
  } catch (error) {
    console.error('Failed to load debts:', error);
  }
}

onMounted(async () => {
  await loadDebts();
});
</script>
