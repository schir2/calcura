<script setup lang="ts">

import type {Ira, IraUpdate} from "#shared/types/Ira";
import {calculateIraContribution} from "~/models/ira/IraIManager";

type Props = {
  ira: Ira
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: IraUpdate]
  delete: [id: number]
}>()

function handleDelete() {
  emit('delete', props.ira.id)
}

function handleUpdate(id: number, update: IraUpdate) {
  emit('update', id, update)
  showModal.value = false
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
    <IraUpdateForm :id="ira.id"
                  @update="handleUpdate"
                  @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @delete="handleDelete"
      :title="ira.name"
      :modelName="'ira'"
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