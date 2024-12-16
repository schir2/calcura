<template>
  <n-modal v-model:show="showModal">
    <CashReserveForm :cashReservePartial="cashReserve" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <span>{{ cashReserve.name }}</span>
      </template>
      <template #default>
        <ul class="grid grid-cols-5">
        </ul>
      </template>
      <template #header-extra>
        <ListItemButtons @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-thing>
  </n-list-item>

</template>
<script setup lang="ts">

import type {CashReserve} from "~/models/cashReserve/CashReserve";

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