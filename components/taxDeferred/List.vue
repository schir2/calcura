<template>
  <n-card title="Tax Deferred (s)">
    <TaxDeferredListItem v-for="(taxDeferred, index) in taxDeferreds"
                                   :taxDeferred="taxDeferred" :key="taxDeferred.id"
                                   :incomes="incomes"
                                   @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                                   @remove="handleRemove"></TaxDeferredListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {
  TaxDeferred,
  TaxDeferredTemplate
} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";

interface Props {
  taxDeferreds: TaxDeferred[]
  incomes: Income[] | undefined
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(taxDeferred: TaxDeferred) {
  emit('delete', taxDeferred);
}

function handleCreate(taxDeferredTemplate: TaxDeferredTemplate) {
  emit('create', taxDeferredTemplate);
}

function handleUpdate(taxDeferred: TaxDeferred) {
  emit('update', taxDeferred);
}

function handleRemove(taxDeferred: TaxDeferred) {
  emit('remove', taxDeferred)
}

</script>