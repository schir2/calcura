<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredForm :initialValues="taxDeferred" mode="edit"
                               @delete="handleDelete"
                               @create="handleCreate"
                               @update="handleUpdate"
                               @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="taxDeferred.name"
      :modelName="ModelName.Ira"
      :tags="[
          {label: taxDeferred.electiveContributionStrategy, },
          {label: taxDeferred.employerContributionStrategy, },
          {label: `Growth ${taxDeferred.growthRate}%`, iconName: 'growthRate', hide: taxDeferred.growthRate === 0},
      ]">
  </command-list-item>

</template>
<script setup lang="ts">

import type {TaxDeferred} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";
import {ModelName} from "~/types/ModelName";

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