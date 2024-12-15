<template>
  <CashReserveList :cashReserves="cashReserveConfigs"
            @createCashReserve="handleCreateCashReserve"
            @updateCashReserve="handleUpdateCashReserve"
            @deleteCashReserve="handleDeleteCashReserve"
  ></CashReserveList>
</template>
<script setup lang="ts">
import {defaultCashReserveFactory} from "~/models/cashReserve/CashReserveFactories";
import type {CashReserve} from "~/models/cashReserve/CashReserve";

import {useCashReserveService} from "~/composables/api/useCashReserveService";

const cashReserveService = useCashReserveService();


async function handleCreateCashReserve() {
  const cashReserve = defaultCashReserveFactory();
  await cashReserveService.create(cashReserve)
  await loadCashes();
}

async function handleUpdateCashReserve(cashReserve: CashReserve) {
  await cashReserveService.update(cashReserve.id, cashReserve)
  await loadCashes();
}

async function handleDeleteCashReserve(index: number) {
  await cashReserveService.delete(index)
  await loadCashes();
}

const {$api} = useNuxtApp()

const cashReserveConfigs = ref<CashReserve[]>([])

async function loadCashes() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    cashReserveConfigs.value = await cashReserveService.list();
  } catch (error) {
    console.error('Error loading cashReserves:', error);
  }
}

onMounted(async () => {
  await loadCashes();
});
</script>
