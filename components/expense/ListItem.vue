<template>
  <n-modal v-model:show="showModal">
    <ExpenseForm :initialValues="expense" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="expense.name"
      :modelName="ModelName.Expense"
      :tags="[
          {label: expense.expenseType, iconName:expense.expenseType},
          {label: expense.frequency, iconName: 'frequency'},
          {label: 'Grows with Inflation', iconName: 'inflation', hide: !expense.growsWithInflation},
          {label: 'Essential', iconName: 'essential', hide: !expense.isEssential},
          {label: 'Deductible', iconName: 'deductible', hide: !expense.isTaxDeductible},
          {label: `Growth ${expense.growthRate}%`, iconName: 'growthRate', hide: expense.growthRate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(getAnnualAmount(expense.amount, expense.frequency)) }}/year
    </template>
  </command-list-item>

</template>
<script setup lang="ts">

import type {Expense} from "~/types/Expense";
import {getAnnualAmount} from "~/utils";
import {ModelName} from "~/types/ModelName";

interface Props {
  expense: Expense
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.expense);
}

function handleUpdate(expense: Partial<Expense>) {
  emit('update', expense)
  showModal.value = false;
}


function handleCreate(expensePartial: Partial<Expense>) {
  emit('create', expensePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.expense);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>