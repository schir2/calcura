<template>

  <h2 class="text-3xl">Income(s)</h2>
  <IncomeTemplatePicker  @save="handleCreateIncome" />
  <div class="container">
    <NList>
      <Income v-for="(income, index) in incomes" :income="income" :key="income.id"
              @deleteIncome="handleDeleteIncome" @updateIncome="handleUpdateIncome"></Income>
    </NList>
  </div>

</template>
<script lang="ts" setup>
import type {Income} from "~/models/income/Income";
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";

interface Props {
  incomes: Income[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteIncome', 'updateIncome', 'createIncome']);

function handleDeleteIncome(incomeId: number) {
  emit('deleteIncome', incomeId);
}

function handleCreateIncome(incomeTemplate: IncomeTemplate) {
  emit('createIncome', incomeTemplate);
}

function handleUpdateIncome(income: Income) {
  emit('updateIncome', income);
}

</script>