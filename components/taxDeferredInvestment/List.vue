<template>
  <n-card title="Tax Deferred Investment(s)">
    <TaxDeferredInvestmentListItem v-for="(taxDeferredInvestment, index) in taxDeferredInvestments"
                                   :taxDeferredInvestment="taxDeferredInvestment" :key="taxDeferredInvestment.id"
                                   :incomes="incomes"
                                   @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                                   @remove="handleRemove"></TaxDeferredInvestmentListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {
  TaxDeferredInvestment,
  TaxDeferredInvestmentTemplate
} from "~/types/TaxDeferredInvestment";
import type {Income} from "~/types/Income";

interface Props {
  taxDeferredInvestments: TaxDeferredInvestment[]
  incomes: Income[] | undefined
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(taxDeferredInvestment: TaxDeferredInvestment) {
  emit('delete', taxDeferredInvestment);
}

function handleCreate(taxDeferredInvestmentTemplate: TaxDeferredInvestmentTemplate) {
  emit('create', taxDeferredInvestmentTemplate);
}

function handleUpdate(taxDeferredInvestment: TaxDeferredInvestment) {
  emit('update', taxDeferredInvestment);
}

function handleRemove(taxDeferredInvestment: TaxDeferredInvestment) {
  emit('remove', taxDeferredInvestment)
}

</script>