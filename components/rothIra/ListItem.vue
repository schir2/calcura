<template>
  <n-modal v-model:show="showModal">
    <RothIraForm :initialValues="rothIra" mode="edit"
                           @create="handleCreate"
                           @update="handleUpdate"
                           @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="rothIra.name"
      :modelName="ModelName.Ira"
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

import type {RothIra, RothIraInsert, RothIraUpdate} from "~/types/RothIra";
import {ModelName} from "~/types/ModelName";
import {calculateIraContribution} from "~/models/ira/IraIManager";

type Props = {
  rothIra: RothIra
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: RothIraInsert]
  update: [id: number, update: RothIraUpdate]
  delete: [id: number]
  remove: [rothIra: RothIra]
}>()

function handleDelete() {
  emit('delete', props.rothIra.id)
}

function handleUpdate(r: RothIra) {
  const { id, ...update } = r
  emit('update', id, update as RothIraUpdate)
  showModal.value = false
}

function handleCreate(rothIraPartial: Partial<RothIra>) {
  emit('create', rothIraPartial as RothIraInsert)
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