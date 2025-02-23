<template>
  <n-card title="Income(s)">
    <n-list>
      <IncomeListItem v-for="(income, index) in incomes" :income="income" :key="income.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></IncomeListItem>
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

function handleDelete(income: Income) {
  emit('delete', income);
}

function handleCreate(incomeTemplate: IncomeTemplate) {
  emit('create', incomeTemplate);
}

function handleUpdate(income: Income) {
  emit('update', income);
}

function handleRemove(income: Income) {
  emit('remove', income)
}

</script>