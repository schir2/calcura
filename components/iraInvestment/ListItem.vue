<template>
  <n-modal v-model:show="showModal">
    <IraInvestmentForm :initialValues="iraInvestment" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
    <n-card size="small">
      <template #header>
        <span>{{ iraInvestment.name }}</span>
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

import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";

interface Props {
  iraInvestment: IraInvestment
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.iraInvestment);
}

function handleUpdate(iraInvestment: Partial<IraInvestment>) {
  emit('update', iraInvestment)
  showModal.value = false;
}


function handleCreate(iraInvestmentPartial: Partial<IraInvestment>) {
  emit('create', iraInvestmentPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.iraInvestment);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>