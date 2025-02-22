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
  TaxDeferredInvestment,
  TaxDeferredInvestmentPartial
} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

import {useTaxDeferredInvestmentService} from "~/composables/api/useTaxDeferredInvestmentService";
import type {Income} from "~/models/income/Income";

const taxDeferredInvestmentService = useTaxDeferredInvestmentService();
const incomeService = useIncomeService()


async function handleCreateTaxDeferredInvestment(taxDeferredInvestmentTemplate: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentTemplate)
  await loadTaxDeferredInvestments();
}

async function handleDeleteTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.remove(taxDeferredInvestment.id)
  await loadTaxDeferredInvestments();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
  await loadTaxDeferredInvestments();
}

const taxDeferredInvestments = ref<TaxDeferredInvestment[]>([])
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
