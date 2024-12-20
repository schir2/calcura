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
    <n-thing class="p-1">
      <template #header><h3 class="text-xl">{{ expense.name }}</h3></template>
      <ul class="grid grid-cols-2 items-end">
        <li>
          <ul class="flex">
            <n-tag><template #icon>
              <Icon v-if="expense.expenseType==='fixed'" name="mdi-lock"/>
              <Icon v-else-if="expense.expenseType==='variable'" name="mdi-tune"/>
            </template>{{ expense.expenseType }}</n-tag>
            <n-tag type="info">
              <template #icon>
                <Icon name="mdi-calendar"></Icon>
              </template>{{ expense.frequency }}
            </n-tag>
            <n-tag v-if="expense.growthRate && !expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"></Icon>
              </template>
              {{ expense.growthRate }}%</n-tag>
            <n-tag type="warning" v-if="expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"/>
              </template>
              Grows With Inflation
            </n-tag>
            <n-tag type="success" v-if="expense.isTaxDeductible">
              <template #icon>
                <Icon name="mdi:cash"/>
              </template>
              Tax Deductible
            </n-tag>
            <n-tag type="error" v-if="expense.isEssential">
              <template #icon>
                <Icon name="uil:exclamation-circle"></Icon>
              </template>
              Essential
            </n-tag>
          </ul>
        </li>
        <li class="text-end">
          <n-statistic :value="$humanize.intComma(expense.amount)"><template #prefix>$</template></n-statistic>
        </li>
      </ul>
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