<template>
  <TaxDeferredList :taxDeferreds="taxDeferredInvestments"
                             @create="handleCreateTaxDeferredInvestment"
                             @update="handleUpdateTaxDeferredInvestment"
                             @delete="handleDeleteTaxDeferredInvestment"
                             :incomes="incomes"
  ></TaxDeferredList>
</template>
<script setup lang="ts">
import type {TaxDeferred, TaxDeferredInsert, TaxDeferredUpdate} from "#shared/types/TaxDeferred";

import {useTaxDeferredService} from "~/composables/api/useTaxDeferredService";
import type {Income} from "#shared/types/Income";

const taxDeferredInvestmentService = useTaxDeferredService();
const incomeService = useIncomeService()


async function handleCreateTaxDeferredInvestment(insert: TaxDeferredInsert) {
  await taxDeferredInvestmentService.create(insert)
  await loadTaxDeferredInvestments();
}

async function handleDeleteTaxDeferredInvestment(id: number) {
  await taxDeferredInvestmentService.remove(id)
  await loadTaxDeferredInvestments();
}

async function handleUpdateTaxDeferredInvestment(id: number, update: TaxDeferredUpdate) {
  await taxDeferredInvestmentService.update(id, update)
  await loadTaxDeferredInvestments();
}

const taxDeferredInvestments = ref<TaxDeferred[]>([])
const incomes = ref<Income[]>([])
const loading = ref<boolean>(true);

async function loadTaxDeferredInvestments() {
  try {
    taxDeferredInvestments.value = await taxDeferredInvestmentService.list();
  } catch (error) {
    console.error('Error loading taxDeferredInvestments:', error);
  }
  loading.value = false;
}

async function loadIncomes() {
  try {
    incomes.value = await incomeService.list();
  } catch (error) {
    console.error('Error loading incomes:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadTaxDeferredInvestments();
  await loadIncomes()
});
</script>
