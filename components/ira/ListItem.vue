<script setup lang="ts">

import type {Ira, IraInsert, IraUpdate} from "~/types/Ira";
import {ModelName} from "~/types/ModelName";
import {calculateIraContribution} from "~/models/ira/IraIManager";

type Props = {
  ira: Ira
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: IraInsert]
  update: [id: number, update: IraUpdate]
  delete: [id: number]
  remove: [ira: Ira]
}>()

function handleDelete() {
  emit('delete', props.ira.id)
}

function handleUpdate(ira: Ira) {
  const { id, ...update } = ira
  emit('update', id, update as IraUpdate)
  showModal.value = false
}

function handleCreate(iraPartial: Partial<Ira>) {
  emit('create', iraPartial as IraInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', props.ira)
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
    <IraForm :initialValues="ira" mode="edit"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="ira.name"
      :modelName="ModelName.Ira"
      :tags="[
          {label: ira.contribution_strategy, },
          {label: `Growth ${ira.growth_rate}%`, iconName: 'growthRate', hide: ira.growth_rate === 0},
      ]"
  >
    <template #summary>
      -${{
        $humanize.intComma(calculateIraContribution(ira, ira.income?.gross_income, IRA_CONTRIBUTION_LIMIT_2024))
      }}/year
    </template>
  </command-list-item>
</template>