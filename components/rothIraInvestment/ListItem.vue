<template>
  <n-modal v-model:show="showModal">
    <RothIraInvestmentForm :initialValues="rothIraInvestment" mode="edit"
                           @delete="handleDelete"
                           @create="handleCreate"
                           @update="handleUpdate"
                           @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{ rothIraInvestment.name }} <NuxtLink :to="{name: 'rothIraInvestments-id-Form', params:{id:rothIraInvestment.id}}">
        <n-button circle secondary type="primary" size="small">
          <template #icon>
            <Icon name="mdi:open-in-new"/>
          </template>
        </n-button>
      </NuxtLink></span>
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
<script setup lang="ts">

import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";

interface Props {
  rothIraInvestment: RothIraInvestment
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.rothIraInvestment);
}

function handleUpdate(rothIraInvestment: Partial<RothIraInvestment>) {
  emit('update', rothIraInvestment)
  showModal.value = false;
}


function handleCreate(rothIraInvestmentPartial: Partial<RothIraInvestment>) {
  emit('create', rothIraInvestmentPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.rothIraInvestment);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>