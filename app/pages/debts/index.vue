<template>
  <DebtList :debts="debtStore.list"
               @create="handleCreateDebt"
               @update="handleUpdateDebt"
               @delete="handleDeleteDebt"
  ></DebtList>
</template>
<script setup lang="ts">
import type {DebtInsert, DebtUpdate} from "#shared/types/Debt";

const debtStore = useDebtStore()

onMounted(() => debtStore.fetchAll())

async function handleCreateDebt(insert: DebtInsert) {
  await debtStore.create(insert)
}

async function handleDeleteDebt(id: number) {
  await debtStore.purge(id)
}

async function handleUpdateDebt(id: number, update: DebtUpdate) {
  await debtStore.patch(id, update)
}
</script>