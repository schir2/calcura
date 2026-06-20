<template>
  <CashReserveList :cashReserves="cashReserves"
               @create="handleCreateCashReserve"
               @update="handleUpdateCashReserve"
               @delete="handleDeleteCashReserve"
  ></CashReserveList>
</template>
<script setup lang="ts">
import type {CashReserve, CashReserveInsert, CashReserveUpdate} from "#shared/types/CashReserve";

import {useCashReserveService} from "~/composables/api/useCashReserveService";

const cashReserveService = useCashReserveService();


async function handleCreateCashReserve(insert: CashReserveInsert) {
  await cashReserveService.create(insert)
  await loadCashReserves();
}

async function handleDeleteCashReserve(id: number) {
  await cashReserveService.remove(id)
  await loadCashReserves();
}

async function handleUpdateCashReserve(id: number, update: CashReserveUpdate) {
  await cashReserveService.update(id, update)
  await loadCashReserves();
}

const cashReserves = ref<CashReserve[]>([])
const loading = ref<boolean>(true);

async function loadCashReserves() {
  try {
    cashReserves.value = await cashReserveService.list();
  } catch (error) {
    console.error('Error loading cash-reserves:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadCashReserves();
});
</script>
