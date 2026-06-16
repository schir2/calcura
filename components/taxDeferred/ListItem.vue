<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredForm :initialValues="taxDeferred" mode="edit"
                     :incomes="incomes"
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
          {label: taxDeferred.elective_contribution_strategy, },
          {label: taxDeferred.employer_contribution_strategy, },
          {label: `Growth ${taxDeferred.growth_rate}%`, iconName: 'growthRate', hide: taxDeferred.growth_rate === 0},
      ]">
  </command-list-item>
</template>
<script setup lang="ts">

import type {TaxDeferred} from "~/types/TaxDeferred";
import {ModelName} from "~/types/ModelName";
import type {Income} from "~/types/Income";

interface Props {
  taxDeferred: TaxDeferred
  incomes: Income[]
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