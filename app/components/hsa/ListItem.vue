<script setup lang="ts">

import type {Hsa, HsaUpdate} from "#shared/types/Hsa";
import {calculateHsaContribution} from "~/models/hsa/HsaManager";

type Props = {
  hsa: Hsa
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: HsaUpdate]
  delete: [id: number]
  remove: [hsa: Hsa]
}>()

function handleDelete() {
  emit('delete', props.hsa.id)
}

function handleUpdate(id: number, update: HsaUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.hsa)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>
<template>
  <n-modal v-model:show="showModal">
    <HsaUpdateForm :id="hsa.id"
                  @update="handleUpdate"
                  @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="hsa.name"
      :modelName="'hsa'"
      :tags="[
          {label: hsa.contribution_strategy, },
          {label: `Growth ${hsa.growth_rate}%`, iconName: 'growthRate', hide: hsa.growth_rate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(calculateHsaContribution(hsa)) }}/year
    </template>
  </command-list-item>
</template>
