<template>
  <n-modal v-model:show="showModal">
    <IncomeForm :incomePartial="income" mode="edit"
                @delete="handleDelete"
                @create="handleCreate"
                @update="handleUpdate"
                @cancel="handleClose"
    />
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <span>{{ income.name }}</span> <NuxtLink :to="{name: 'incomes-id', params: {id: income.id}}"><Icon name="mdi:open-in-new"/></NuxtLink>
      </template>
      <template #default>
      <ul class="grid grid-cols-5">
        <li>
          <n-tag type="info" size="small">{{ income.incomeType }}</n-tag>
        </li>
        <li>{{ income.grossIncome }}</li>
        <li class="text-end col-span-2">
        </li>
      </ul>
      </template>
      <template #header-extra>
        <ListItemButtons @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-thing>
  </n-list-item>

</template>
<script setup lang="ts">

import type {Income} from "~/models/income/Income";

interface Props {
  income: Income
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.income);
}

function handleUpdate(income: Partial<Income>) {
  emit('update', income)
  showModal.value = false;
}


function handleCreate(incomePartial: Partial<Income>) {
  emit('create', incomePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.income);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>