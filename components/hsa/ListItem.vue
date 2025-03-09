<template>
  <n-modal v-model:show="showModal">
    <HsaForm :initialValues="hsa" mode="edit"
                     @delete="handleDelete"
                     @create="handleCreate"
                     @update="handleUpdate"
                     @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="hsa.name"
      :modelName="ModelName.Hsa">
  </command-list-item>

</template>
<script setup lang="ts">

import type {Hsa} from "~/types/Hsa";
import {ModelName} from "~/types/ModelName";

interface Props {
  hsa: Hsa
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.hsa);
}

function handleUpdate(hsa: Partial<Hsa>) {
  emit('update', hsa)
  showModal.value = false;
}


function handleCreate(hsaPartial: Partial<Hsa>) {
  emit('create', hsaPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.hsa);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>