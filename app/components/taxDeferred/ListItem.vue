<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredForm :initialValues="taxDeferred" mode="edit"
                     :incomes="incomes"
                     @create="handleCreate"
                     @update="handleUpdate"
                     @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="taxDeferred.name"
      :modelName="'ira'"
      :tags="[
          {label: taxDeferred.elective_contribution_strategy, },
          {label: taxDeferred.employer_contribution_strategy, },
          {label: `Growth ${taxDeferred.growth_rate}%`, iconName: 'growthRate', hide: taxDeferred.growth_rate === 0},
      ]">
  </command-list-item>
</template>
<script setup lang="ts">

import type {TaxDeferred, TaxDeferredInsert, TaxDeferredUpdate} from "#shared/types/TaxDeferred";
import {ModelName} from "#shared/types/ModelName";
import type {Income} from "#shared/types/Income";

type Props = {
  taxDeferred: TaxDeferred
  incomes: Income[]
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: TaxDeferredInsert]
  update: [id: number, update: TaxDeferredUpdate]
  delete: [id: number]
  remove: [taxDeferred: TaxDeferred]
}>()

function handleDelete() {
  emit('delete', props.taxDeferred.id)
}

function handleUpdate(t: TaxDeferred) {
  const { id, ...update } = t
  emit('update', id, update as TaxDeferredUpdate)
  showModal.value = false
}

function handleCreate(taxDeferredPartial: Partial<TaxDeferred>) {
  emit('create', taxDeferredPartial as TaxDeferredInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.taxDeferred)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>