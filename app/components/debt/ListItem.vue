<script setup lang="ts">

import type {Debt, DebtUpdate} from "#shared/types/Debt";
import {calculateDebtPayment} from "~/models/debt/DebtManager";

type Props = {
  debt: Debt
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: DebtUpdate]
  delete: [id: number]
}>()

function handleDelete() {
  emit('delete', props.debt.id)
}

function handleUpdate(id: number, update: DebtUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>
<template>
  <n-modal v-model:show="showModal">
    <DebtUpdateForm :id="debt.id"
                   @update="handleUpdate"
                   @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @delete="handleDelete"
      :title="debt.name"
      :modelName="'debt'"
      :tags="[
          {label: debt.frequency, iconName: 'frequency'},
          {label: `Interest ${debt.interest_rate}%`, iconName: 'interest', hide: debt.interest_rate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(calculateDebtPayment(debt, debt.principal)) }}/year
    </template>
  </command-list-item>

</template>