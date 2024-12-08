<template>
  <CommonButton @click="handleCreateIncome()">Add</CommonButton>
  <div class="container">
    <Income v-for="(incomeConfig, index) in incomes" :incomeConfig="incomeConfig" :key="incomeConfig.id"
          @deleteIncome="handleDeleteIncome" @updateIncome="handleUpdateIncome"></Income>
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