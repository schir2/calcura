<template>
  <TaxDeferredInvestmentList :taxDeferredInvestments="taxDeferredInvestments"
            @createTaxDeferredInvestment="handleCreateTaxDeferredInvestment"
            @updateTaxDeferredInvestment="handleUpdateTaxDeferredInvestment"
            @deleteTaxDeferredInvestment="handleDeleteTaxDeferredInvestment"
  ></TaxDeferredInvestmentList>
</template>
<script setup lang="ts">


import {defaultTaxDeferredInvestmentFactory} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentFactories";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

const taxDeferredInvestmentService = useTaxDeferredInvestmentService();


async function handleCreateTaxDeferredInvestment() {
  const taxDeferredInvestmentConfig = defaultTaxDeferredInvestmentFactory();
  await taxDeferredInvestmentService.create(taxDeferredInvestmentConfig)
  await loadTaxDeferredInvestments();
}

async function handleDeleteTaxDeferredInvestment(index: number) {
  await taxDeferredInvestmentService.delete(index)
  await loadTaxDeferredInvestments();
}

async function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  await taxDeferredInvestmentService.update(taxDeferredInvestment.id, taxDeferredInvestment)
  await loadTaxDeferredInvestments();
}

const {$api} = useNuxtApp()

const taxDeferredInvestments = ref<TaxDeferredInvestment[]>([])

async function loadTaxDeferredInvestments() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    taxDeferredInvestments.value = await taxDeferredInvestmentService.list();
  } catch (error) {
    console.error('Error loading taxDeferredInvestments:', error);
  }
}

onMounted(async () => {
  await loadTaxDeferredInvestments();
});
</script>
