<template>
  <n-modal v-model:show="showModal">
    <RothIraInvestmentForm :rothIraInvestmentPartial="rothIraInvestment" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <span>{{ rothIraInvestment.name }}</span>
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

import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";

interface Props {
  rothIraInvestment: RothIraInvestment
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.rothIraInvestment);
}

function handleUpdate(rothIraInvestment: Partial<RothIraInvestment>) {
  emit('update', rothIraInvestment)
  showModal.value = false;
}


function handleCreate(rothIraInvestmentPartial: Partial<RothIraInvestment>) {
  emit('create', rothIraInvestmentPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.rothIraInvestment);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>