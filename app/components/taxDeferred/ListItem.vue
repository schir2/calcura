<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredUpdateForm :id="taxDeferred.id"
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

import type {TaxDeferred, TaxDeferredUpdate} from "#shared/types/TaxDeferred";
import type {ModelName} from "#shared/types/ModelName";

type Props = {
  taxDeferred: TaxDeferred
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: TaxDeferredUpdate]
  delete: [id: number]
  remove: [taxDeferred: TaxDeferred]
}>()

function handleDelete() {
  emit('delete', props.taxDeferred.id)
}

function handleUpdate(id: number, update: TaxDeferredUpdate) {
  emit('update', id, update)
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