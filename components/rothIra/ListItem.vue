<template>
  <n-modal v-model:show="showModal">
    <RothIraForm :initialValues="rothIra" mode="edit"
                           @delete="handleDelete"
                           @create="handleCreate"
                           @update="handleUpdate"
                           @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{ rothIra.name }}</span>
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

import type {RothIra} from "~/types/RothIra";

interface Props {
  rothIra: RothIra
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.rothIra);
}

function handleUpdate(rothIra: Partial<RothIra>) {
  emit('update', rothIra)
  showModal.value = false;
}


function handleCreate(rothIraPartial: Partial<RothIra>) {
  emit('create', rothIraPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.rothIra);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>