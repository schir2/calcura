<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredForm :initialValues="taxDeferred" mode="edit"
                               @delete="handleDelete"
                               @create="handleCreate"
                               @update="handleUpdate"
                               @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{taxDeferred.id}} {{ taxDeferred.name }}</span>
      <n-tag>{{ taxDeferred.electiveContributionStrategy }}</n-tag>
      <n-tag>{{ taxDeferred.employerContributionStrategy }}</n-tag>
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

import type {TaxDeferred} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";

interface Props {
  taxDeferred: TaxDeferred
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.taxDeferred);
}

function handleUpdate(taxDeferred: Partial<TaxDeferred>) {
  emit('update', taxDeferred)
  showModal.value = false;
}


function handleCreate(taxDeferredPartial: Partial<TaxDeferred>) {
  emit('create', taxDeferredPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.taxDeferred);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>