<script setup lang="ts">

import type {Debt, DebtInsert, DebtUpdate} from "#shared/types/Debt";
import {calculateDebtPayment} from "~/models/debt/DebtManager";

type Props = {
  debt: Debt
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: DebtInsert]
  update: [id: number, update: DebtUpdate]
  delete: [id: number]
  remove: [debt: Debt]
}>()

function handleDelete() {
  emit('delete', props.debt.id)
}

function handleUpdate(debt: Debt) {
  const {id, ...update} = debt
  emit('update', id, update as DebtUpdate)
  showModal.value = false
}

function handleCreate(debtPartial: Partial<Debt>) {
  emit('create', debtPartial as DebtInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.debt)
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
    <DebtForm :initialValues="debt" mode="edit"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
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