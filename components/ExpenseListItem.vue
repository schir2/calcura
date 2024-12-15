<template>
  <n-modal v-model:show="showModal">
    <ExpenseForm :expensePartial="expense" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <span>{{ expense.name }}</span>
      </template>
      <template #default>
        <ul class="grid grid-cols-5">
        </ul>
      </template>
      <template #header-extra>
        <ListItemButtons @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-thing>
  </n-list-item>

</template>
<script setup lang="ts">

import type {Expense} from "~/models/expense/Expense";

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