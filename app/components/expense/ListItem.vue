<template>
  <n-modal v-model:show="showModal">
    <ExpenseUpdateForm :id="expense.id"
                      @update="handleUpdate"
                      @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="expense.name"
      :modelName="'expense'"
      :tags="[
          {label: expense.expense_type, iconName:expense.expense_type},
          {label: expense.frequency, iconName: 'frequency'},
          {label: 'Grows with Inflation', iconName: 'inflation', hide: !expense.grows_with_inflation},
          {label: 'Essential', iconName: 'essential', hide: !expense.is_essential},
          {label: 'Deductible', iconName: 'deductible', hide: !expense.is_tax_deductible},
          {label: `Growth ${expense.growth_rate}%`, iconName: 'growthRate', hide: expense.growth_rate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(getAnnualAmount(expense.amount, expense.frequency)) }}/year
    </template>
  </command-list-item>

</template>
<script setup lang="ts">

import type {Expense, ExpenseUpdate} from "#shared/types/Expense";
import {getAnnualAmount} from "~/utils";

type Props = {
  expense: Expense
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: ExpenseUpdate]
  delete: [id: number]
  remove: [expense: Expense]
}>()

function handleDelete() {
  emit('delete', props.expense.id)
}

function handleUpdate(id: number, update: ExpenseUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.expense)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>