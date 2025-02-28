<template>
  <TaxDeferredInvestmentList :taxDeferredInvestments="taxDeferredInvestments"
                             @create="handleCreateTaxDeferredInvestment"
                             @update="handleUpdateTaxDeferredInvestment"
                             @delete="handleDeleteTaxDeferredInvestment"
                             :incomes="incomes"
  ></TaxDeferredInvestmentList>
</template>
<script setup lang="ts">
import type {
  TaxDeferred,
  TaxDeferredInvestmentPartial
} from "~/types/TaxDeferred";

import {useTaxDeferredService} from "~/composables/api/useTaxDeferredService";
import type {Income} from "~/types/Income";

const taxDeferredInvestmentService = useTaxDeferredService();
const incomeService = useIncomeService()


async function handleCreateTaxDeferredInvestment(taxDeferredInvestmentTemplate: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentTemplate)
  await loadTaxDeferredInvestments();
}

async function handleDeleteTaxDeferredInvestment(taxDeferredInvestment: TaxDeferred) {
  await taxDeferredInvestmentService.delete(taxDeferredInvestment.id)
  await loadTaxDeferredInvestments();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferred) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
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
