<template>
  <n-modal v-model:show="showModal">
    <CashReserveForm :initialValues="cashReserve" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
    <n-card size="small">
      <template #header>
        <span>{{ cashReserve.name }}</span>
      </template>

      <ul class="grid grid-cols-2 items-end">
        <li>
          <span class="flex">
            <n-tag>{{ cashReserve.cashReserveStrategy }}</n-tag>
          </span>
        </li>
        <li class="text-end">
          <span class="text-lg">${{$humanize.intComma(cashReserve.initialAmount)}}</span>
        </li>
      </ul>
      <template #header-extra>
        <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-card>

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