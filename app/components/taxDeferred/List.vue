<template>
  <n-card title="Tax Deferred (s)">
    <TaxDeferredListItem v-for="(taxDeferred, index) in taxDeferreds"
                                   :taxDeferred="taxDeferred" :key="taxDeferred.id"
                                   :incomes="incomes"
                                   @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></TaxDeferredListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {TaxDeferred, TaxDeferredInsert, TaxDeferredUpdate} from "#shared/types/TaxDeferred";
import type {Income} from "#shared/types/Income";

type Props = {
  taxDeferreds: TaxDeferred[]
  incomes: Income[] | undefined
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: TaxDeferredInsert]
  update: [id: number, update: TaxDeferredUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: TaxDeferredInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: TaxDeferredUpdate) {
  emit('update', id, update)
}

</script>