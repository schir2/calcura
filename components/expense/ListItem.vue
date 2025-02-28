<template>
  <n-modal v-model:show="showModal">
    <ExpenseForm :initialValues="expense" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <h3 class="flex items-center gap-2 text-lg">
        <base-ico class="text-skin-warning" name="expense"/>
        {{ expense.name }}
      </h3>
    </template>
    <ul class="grid grid-cols-2 items-end">
      <li>
          <span class="flex">
            <n-tag><template #icon>
              <Icon v-if="expense.expenseType==='fixed'" name="mdi-lock"/>
              <Icon v-else-if="expense.expenseType==='variable'" name="mdi-tune"/>
            </template><span class="hidden md:inline">{{ expense.expenseType }}</span></n-tag>
            <n-tag>
              <template #icon>
                <Icon name="mdi-calendar"></Icon>
              </template>
              <span class="hidden md:inline">{{ expense.frequency }}</span>
            </n-tag>
            <n-tag v-if="expense.growthRate && !expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"></Icon>
              </template>
              <span class="hidden md:inline">{{ expense.growthRate }}%</span></n-tag>
            <n-tag v-if="expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"/>
              </template>
              <span class="hidden md:inline">Grows With Inflation</span>
            </n-tag>
            <n-tag v-if="expense.isTaxDeductible">
              <template #icon>
                <Icon name="mdi:cash"/>
              </template>
              <span class="hidden md:inline">Tax Deductible</span>
            </n-tag>
            <n-tag v-if="expense.isEssential">
              <template #icon>
                <Icon name="uil:exclamation-circle"></Icon>
              </template>
              <span class="hidden md:inline">Essential</span>
            </n-tag>
          </span>
      </li>
      <li class="text-end">
        <span class="text-lg">${{ $humanize.intComma(getAnnualAmount(expense.amount, expense.frequency)) }}/year</span>
      </li>
    </ul>
    <template #header-extra>
      <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
    </template>
  </n-card>

</template>
<script setup lang="ts">

import type {Expense} from "~/types/Expense";
import {getAnnualAmount} from "~/utils";

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