<template>
  <n-card title="TaxDeferredInvestment(s)">
    <template #header-extra>
      <TaxDeferredInvestmentTemplatePicker @create="handleCreate"/>
    </template>
    <n-list>
      <TaxDeferredInvestmentListItem v-for="(taxDeferredInvestment, index) in taxDeferredInvestments" :taxDeferredInvestment="taxDeferredInvestment" :key="taxDeferredInvestment.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></TaxDeferredInvestmentListItem>
    </n-list>
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