<template>
  <lazy-n-modal v-model:show="showModal">
    <CashReserveForm :initialValues="cashReserve" mode="edit"
                     @delete="handleDelete"
                     @create="handleCreate"
                     @update="handleUpdate"
                     @cancel="handleClose"
    />
  </lazy-n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="cashReserve.name"
      :modelName="ModelName.CashReserve">
  </command-list-item>

</template>
<script setup lang="ts">

import type {CashReserve} from "~/types/CashReserve";
import {ModelName} from "~/types/ModelName";

interface Props {
  cashReserve: CashReserve
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.cashReserve);
}

function handleUpdate(cashReserve: Partial<CashReserve>) {
  emit('update', cashReserve)
  showModal.value = false;
}


function handleCreate(cashReservePartial: Partial<CashReserve>) {
  emit('create', cashReservePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.cashReserve);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>