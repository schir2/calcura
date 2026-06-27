<template>
  <TaxDeferredList :taxDeferreds="taxDeferredStore.list"
                             @create="handleCreateTaxDeferredInvestment"
                             @update="handleUpdateTaxDeferredInvestment"
                             @delete="handleDeleteTaxDeferredInvestment"
                             :incomes="incomeStore.list"
  ></TaxDeferredList>
</template>
<script setup lang="ts">
import type {TaxDeferredInsert, TaxDeferredUpdate} from "#shared/types/TaxDeferred";

const taxDeferredStore = useTaxDeferredStore()
const incomeStore = useIncomeStore()

onMounted(() => {
  taxDeferredStore.fetchAll()
  incomeStore.fetchAll()
})

async function handleCreateTaxDeferredInvestment(insert: TaxDeferredInsert) {
  await taxDeferredStore.create(insert)
}

async function handleDeleteTaxDeferredInvestment(id: number) {
  await taxDeferredStore.purge(id)
}

async function handleUpdateTaxDeferredInvestment(id: number, update: TaxDeferredUpdate) {
  await taxDeferredStore.patch(id, update)
}
</script>