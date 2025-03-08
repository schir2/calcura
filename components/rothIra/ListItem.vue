<template>
  <lazy-n-modal v-model:show="showModal">
    <RothIraForm :initialValues="rothIra" mode="edit"
                           @delete="handleDelete"
                           @create="handleCreate"
                           @update="handleUpdate"
                           @cancel="handleClose"
    />
  </lazy-n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="rothIra.name"
      :modelName="ModelName.Ira"
      :tags="[
          {label: rothIra.contributionStrategy, },
          {label: `Growth ${rothIra.growthRate}%`, iconName: 'growthRate', hide: rothIra.growthRate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(calculateIraContribution(rothIra, rothIra.income?.grossIncome, IRA_CONTRIBUTION_LIMIT_2024 )) }}/year
    </template>
  </command-list-item>
</template>
<script setup lang="ts">

import type {RothIra} from "~/types/RothIra";
import {ModelName} from "~/types/ModelName";
import {calculateIraContribution} from "~/models/ira/IraIManager";

interface Props {
  rothIra: RothIra
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.rothIra);
}

function handleUpdate(rothIra: Partial<RothIra>) {
  emit('update', rothIra)
  showModal.value = false;
}


function handleCreate(rothIraPartial: Partial<RothIra>) {
  emit('create', rothIraPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.rothIra);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>