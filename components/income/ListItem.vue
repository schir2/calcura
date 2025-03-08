<template>
  <lazy-n-modal v-model:show="showModal">
    <IncomeForm :initialValues="income" mode="edit"
                @delete="handleDelete"
                @create="handleCreate"
                @update="handleUpdate"
                @cancel="handleClose"
    />
  </lazy-n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="income.name"
      :modelName="ModelName.Income"
      :tags="[
          {label: income.incomeType},
          {label: income.frequency, iconName: 'frequency'},
          {label: `Growth ${income.growthRate}%`, iconName: 'growthRate', hide: income.growthRate === 0},
      ]"
  >
    <template #summary>
      ${{ $humanize.intComma(getAnnualAmount(income.grossIncome, income.frequency)) }}/year
    </template>
  </command-list-item>

</template>
<script setup lang="ts">

import type {Income} from "~/types/Income";
import {getAnnualAmount} from "~/utils";
import {ModelName} from "~/types/ModelName";

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