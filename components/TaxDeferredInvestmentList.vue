<template>
  <NButton @click="handleCreateTaxDeferredInvestment()">Add</NButton>
  <div class="container">
    <TaxDeferredInvestment v-for="(taxDeferredInvestment, index) in taxDeferredInvestments" :taxDeferredInvestment="taxDeferredInvestment" :key="taxDeferredInvestment.id"
                           @deleteTaxDeferredInvestment="handleDeleteTaxDeferredInvestment" @updateTaxDeferredInvestment="handleUpdateTaxDeferredInvestment"></TaxDeferredInvestment>
  </div>

</template>
<script lang="ts" setup>
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

interface Props {
  taxDeferredInvestments: TaxDeferredInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteTaxDeferredInvestment', 'updateTaxDeferredInvestment', 'createTaxDeferredInvestment']);

function handleDeleteTaxDeferredInvestment(taxDeferredInvestmentId: number) {
  emit('deleteTaxDeferredInvestment', taxDeferredInvestmentId);
}

function handleCreateTaxDeferredInvestment() {
  emit('createTaxDeferredInvestment');
}

function handleUpdateTaxDeferredInvestment(taxDeferredInvestment: TaxDeferredInvestment) {
  emit('updateTaxDeferredInvestment', taxDeferredInvestment);
}

</script>