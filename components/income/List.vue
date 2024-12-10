<template>
  <NButton @click="handleCreateIncome()">Add</NButton>
  <div class="container">
    <div class="flex align-middle gap-6">
      <h2 class="text-3xl">Income(s)</h2>
      <NButton iconLeft="mdi:add" @click="handleCreateIncome">Add Income</NButton>
    </div>
    <NList>
    <Income v-for="(incomeConfig, index) in incomes" :incomeConfig="incomeConfig" :key="incomeConfig.id"
          @deleteIncome="handleDeleteIncome" @updateIncome="handleUpdateIncome"></Income>
    </NList>
  </div>

</template>
<script lang="ts" setup>
import type IncomeConfig from "~/models/income/IncomeConfig";

interface Props {
  incomes: IncomeConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteIncome', 'updateIncome', 'createIncome']);
function handleDeleteIncome(incomeId: number){
  emit('deleteIncome',incomeId);
}
function handleCreateIncome(){
  emit('createIncome');
}

function handleUpdateIncome(incomeConfig: IncomeConfig) {
  emit('updateIncome', incomeConfig);
}

</script>