<template>
  <n-modal v-model:show="showModal">
    <RothIraUpdateForm :id="rothIra.id"
                      @update="handleUpdate"
                      @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="rothIra.name"
      :modelName="'ira'"
      :tags="[
          {label: rothIra.contribution_strategy, },
          {label: `Growth ${rothIra.growth_rate}%`, iconName: 'growthRate', hide: rothIra.growth_rate === 0},
      ]"
  >
    <template #summary>
      -${{
        $humanize.intComma(calculateIraContribution(rothIra, rothIra.income?.gross_income, IRA_CONTRIBUTION_LIMIT_2024))
      }}/year
    </template>
  </command-list-item>
</template>
<script setup lang="ts">

import type {RothIra, RothIraUpdate} from "#shared/types/RothIra";
import type {ModelName} from "#shared/types/ModelName";
import {calculateIraContribution} from "~/models/ira/IraIManager";

type Props = {
  rothIra: RothIra
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: RothIraUpdate]
  delete: [id: number]
  remove: [rothIra: RothIra]
}>()

function handleDelete() {
  emit('delete', props.rothIra.id)
}

function handleUpdate(id: number, update: RothIraUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.rothIra)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}
</script>