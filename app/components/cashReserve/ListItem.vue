<template>
  <n-modal v-model:show="showModal">
    <CashReserveUpdateForm :id="cashReserve.id"
                           @update="handleUpdate"
                           @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @delete="handleDelete"
      :title="cashReserve.name"
      :modelName="'cash_reserve'">
  </command-list-item>

</template>
<script setup lang="ts">

import type {CashReserve, CashReserveUpdate} from "#shared/types/CashReserve";

type Props = {
  cashReserve: CashReserve
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: CashReserveUpdate]
  delete: [id: number]
}>()

function handleDelete() {
  emit('delete', props.cashReserve.id)
}

function handleUpdate(id: number, update: CashReserveUpdate) {
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