<template>
  <n-modal v-model:show="showModal">
    <IncomeForm :initialValues="income" mode="edit"
                @create="handleCreate"
                @update="handleUpdate"
                @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="income.name"
      :modelName="'income'"
      :tags="[
          {label: income.income_type},
          {label: income.frequency, iconName: 'frequency'},
          {label: `Growth ${income.growth_rate}%`, iconName: 'growthRate', hide: income.growth_rate === 0},
      ]"
  >
    <template #summary>
      ${{ $humanize.intComma(getAnnualAmount(income.gross_income, income.frequency)) }}/year
    </template>
  </command-list-item>

</template>
<script setup lang="ts">

import type {Income, IncomeInsert, IncomeUpdate} from "#shared/types/Income";
import {getAnnualAmount} from "~/utils";

type Props = {
  income: Income
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: IncomeInsert]
  update: [id: number, update: IncomeUpdate]
  delete: [id: number]
  remove: [income: Income]
}>()

function handleDelete() {
  emit('delete', props.income.id)
}

function handleUpdate(income: Income) {
  const {id, ...update} = income
  emit('update', id, update as IncomeUpdate)
  showModal.value = false
}

function handleCreate(incomePartial: Partial<Income>) {
  emit('create', incomePartial as IncomeInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.income)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>