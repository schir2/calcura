<template>
  <CashReserveList :cashReserves="cashReserves"
               @create="handleCreateCashReserve"
               @update="handleUpdateCashReserve"
               @delete="handleDeleteCashReserve"
  ></CashReserveList>
</template>
<script setup lang="ts">
import type {CashReserve, CashReservePartial} from "~/types/CashReserve";

import {useCashReserveService} from "~/composables/api/useCashReserveService";

const cashReserveService = useCashReserveService();


async function handleCreateCashReserve(cashReserveTemplate: CashReservePartial) {
  const cashReserve = await cashReserveService.create(cashReserveTemplate)
  await loadCashReserves();
}

async function handleDeleteCashReserve(cashReserve: CashReserve) {
  await cashReserveService.delete(cashReserve.id)
  await loadCashReserves();
}

async function handleUpdateCashReserve(cashReserve: CashReserve) {
  await cashReserveService.update(cashReserve.id, cashReserve)
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
