<template>
  <n-card title="Income(s)">
    <template #header-extra>
      <IncomeTemplatePicker @save="handleCreateIncome"/>
    </template>
    <n-list>
      <IncomeListItem v-for="(income, index) in incomes" :income="income" :key="income.id"
                      @delete="handleDeleteIncome" @update="handleUpdateIncome"
                      @remove="handleRemoveIncome"></IncomeListItem>
    </n-list>
  </n-card>

</template>
<script lang="ts" setup>
import type {Income} from "~/models/income/Income";
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";

interface Props {
  incomes: Income[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDeleteIncome(income: Income) {
  emit('delete', income);
}

function handleCreateIncome(incomeTemplate: IncomeTemplate) {
  emit('create', incomeTemplate);
}

function handleUpdateIncome(income: Income) {
  emit('update', income);
}

function handleRemoveIncome(income: Income) {
  emit('remove', income)
}

</script>