<template>

  <h2 class="text-3xl">Debt(s)</h2>
  <NButton @click="handleCreateDebt()">Add</NButton>
  <div class="container">
    <Debt v-for="(debt, index) in debts" :debt="debt" :key="debt.id"
          @deleteDebt="handleDeleteDebt" @updateDebt="handleUpdateDebt"></Debt>
  </div>

</template>
<script lang="ts" setup>
import type {Debt} from "~/models/debt/Debt";

interface Props {
  debts: Debt[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteDebt', 'updateDebt', 'createDebt']);

function handleDeleteDebt(debtId: number) {
  emit('deleteDebt', debtId);
}

function handleCreateDebt() {
  emit('createDebt');
}

function handleUpdateDebt(debtConfig: Debt) {
  emit('updateDebt', debtConfig);
}

</script>