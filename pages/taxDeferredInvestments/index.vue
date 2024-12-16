<template>
  <TaxDeferredInvestmentList :taxDeferredInvestments="taxDeferredInvestments"
               @create="handleCreateTaxDeferredInvestment"
               @update="handleUpdateTaxDeferredInvestment"
               @delete="handleDeleteTaxDeferredInvestment"
  ></TaxDeferredInvestmentList>
</template>
<script setup lang="ts">
import type {TaxDeferredInvestment, TaxDeferredInvestmentPartial} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

import {useTaxDeferredInvestmentService} from "~/composables/api/useTaxDeferredInvestmentService";

const taxDeferredInvestmentService = useTaxDeferredInvestmentService();


async function handleCreateTaxDeferredInvestment(taxDeferredInvestmentTemplate: TaxDeferredInvestmentPartial) {
  const taxDeferredInvestment = await taxDeferredInvestmentService.create(taxDeferredInvestmentTemplate)
  await loadTaxDeferredInvestments();
}

async function handleDeleteTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.delete(taxDeferredInvestment.id)
  await loadTaxDeferredInvestments();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
  await loadTaxDeferredInvestments();
}

const taxDeferredInvestments = ref<TaxDeferredInvestment[]>([])
const loading = ref<boolean>(true);

async function loadTaxDeferredInvestments() {
  try {
    taxDeferredInvestments.value = await taxDeferredInvestmentService.list();
  } catch (error) {
    console.error('Error loading taxDeferredInvestments:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadTaxDeferredInvestments();
});
</script>
