<template>
  <n-modal v-model:show="showModal">
    <BrokerageForm :initialValues="brokerage" mode="edit"
                             @delete="handleDelete"
                             @create="handleCreate"
                             @update="handleUpdate"
                             @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{ brokerage.name }}</span>
    </template>
    <template #default>
      <ul class="grid grid-cols-5">
      </ul>
    </template>
    <template #header-extra>
      <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
    </template>
  </n-card>

</template>
<script setup lang="ts">

import type {Brokerage} from "~/types/Brokerage";

interface Props {
  brokerage: Brokerage
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.brokerage);
}

function handleUpdate(brokerage: Partial<Brokerage>) {
  emit('update', brokerage)
  showModal.value = false;
}


function handleCreate(brokeragePartial: Partial<Brokerage>) {
  emit('create', brokeragePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.brokerage);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>