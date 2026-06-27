<template>
  <CashReserveList :cashReserves="cashReserveStore.list"
               @create="handleCreateCashReserve"
               @update="handleUpdateCashReserve"
               @delete="handleDeleteCashReserve"
  ></CashReserveList>
</template>
<script setup lang="ts">
import type {CashReserveInsert, CashReserveUpdate} from "#shared/types/CashReserve";

const cashReserveStore = useCashReserveStore()

onMounted(() => cashReserveStore.fetchAll())

async function handleCreateCashReserve(insert: CashReserveInsert) {
  await cashReserveStore.create(insert)
}

async function handleDeleteCashReserve(id: number) {
  await cashReserveStore.purge(id)
}

async function handleUpdateCashReserve(id: number, update: CashReserveUpdate) {
  await cashReserveStore.patch(id, update)
}
</script>