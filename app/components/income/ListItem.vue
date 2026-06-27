<template>
  <n-modal v-model:show="showModal">
    <IncomeUpdateForm :id="income.id"
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

import type {Income, IncomeUpdate} from "#shared/types/Income";
import {getAnnualAmount} from "~/utils";

type Props = {
  income: Income
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: IncomeUpdate]
  delete: [id: number]
  remove: [income: Income]
}>()

function handleDelete() {
  emit('delete', props.income.id)
}

function handleUpdate(id: number, update: IncomeUpdate) {
  emit('update', id, update)
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