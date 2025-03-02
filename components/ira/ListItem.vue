<script setup lang="ts">

import type {Ira} from "~/types/Ira";
import {ModelName} from "~/types/ModelName";
import {calculateIraContribution} from "~/models/ira/IraIManager";

interface Props {
  ira: Ira
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.ira);
}

function handleUpdate(ira: Partial<Ira>) {
  emit('update', ira)
  showModal.value = false;
}


function handleCreate(iraPartial: Partial<Ira>) {
  emit('create', iraPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.ira);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>
<template>
  <n-modal v-model:show="showModal">
    <IraForm :initialValues="ira" mode="edit"
                 @delete="handleDelete"
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
          {label: ira.contributionStrategy, },
          {label: `Growth ${ira.growthRate}%`, iconName: 'growthRate', hide: ira.growthRate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(calculateIraContribution(ira, ira.income?.grossIncome, IRA_CONTRIBUTION_LIMIT_2024 )) }}/year
    </template>
  </command-list-item>
    <n-card size="small">
      <template #header>
        <span>{{ ira.name }}</span>
      </template>
      <template #default>
        <ul class="grid grid-cols-5">
        </ul>
      </template>
      <template #header-extra>
        <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-card>

</template>