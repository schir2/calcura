<template>
  <n-modal v-model:show="showModal">
    <CashReserveForm :initialValues="cashReserve" mode="edit"
                     @create="handleCreate"
                     @update="handleUpdate"
                     @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="cashReserve.name"
      :modelName="ModelName.CashReserve">
  </command-list-item>

</template>
<script setup lang="ts">

import type {CashReserve, CashReserveInsert, CashReserveUpdate} from "~/types/CashReserve";
import {ModelName} from "~/types/ModelName";

type Props = {
  cashReserve: CashReserve
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: CashReserveInsert]
  update: [id: number, update: CashReserveUpdate]
  delete: [id: number]
  remove: [cashReserve: CashReserve]
}>()

function handleDelete() {
  emit('delete', props.cashReserve.id)
}

function handleUpdate(c: CashReserve) {
  const { id, ...update } = c
  emit('update', id, update as CashReserveUpdate)
  showModal.value = false
}

function handleCreate(cashReservePartial: Partial<CashReserve>) {
  emit('create', cashReservePartial as CashReserveInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.cashReserve)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>