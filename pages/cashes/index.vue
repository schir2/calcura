<template>
  <CashList :cashes="cashConfigs"
            @createCash="handleCreateCash"
            @updateCash="handleUpdateCash"
            @deleteCash="handleDeleteCash"
  ></CashList>
</template>
<script setup lang="ts">
import {defaultCashFactory} from "~/models/cash/CashFactories";
import type Cash from "~/models/cash/Cash";

import {useCashService} from "~/composables/cashService";

const cashService = useCashService();


async function handleCreateCash() {
  const cash = defaultCashFactory();
  await cashService.create(cash)
  await loadCashes();
}

async function handleDeleteCash(index: number) {
  await cashService.delete(index)
  await loadCashes();
}

async function handleUpdateCash(cash: Cash) {
  assertDefined(cash.id, 'cashId')
  await cashService.update(cash.id, cash)
  await loadCashes();
}

const {$api} = useNuxtApp()

const cashConfigs = ref<Cash[]>([])

async function loadCashes() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    cashConfigs.value = await cashService.list();
  } catch (error) {
    console.error('Error loading cashs:', error);
  }
}

onMounted(async () => {
  await loadCashes();
});
</script>
