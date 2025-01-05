<template>
  <n-card title="Tax Deferred Investment(s)">
    <template #header-extra>
      <TaxDeferredInvestmentTemplatePicker @create="handleCreate"/>
    </template>
      <TaxDeferredInvestmentListItem v-for="(taxDeferredInvestment, index) in taxDeferredInvestments" :taxDeferredInvestment="taxDeferredInvestment" :key="taxDeferredInvestment.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></TaxDeferredInvestmentListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {TaxDeferredInvestment, TaxDeferredInvestmentTemplate} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

interface Props {
  taxDeferredInvestments: TaxDeferredInvestment[]
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