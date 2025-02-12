<template>
  <n-modal v-model:show="showModal">
    <BrokerageInvestmentForm :initialValues="brokerageInvestment" mode="edit"
                             @delete="handleDelete"
                             @create="handleCreate"
                             @update="handleUpdate"
                             @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{ brokerageInvestment.name }}</span>
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

import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";

interface Props {
  brokerageInvestment: BrokerageInvestment
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.brokerageInvestment);
}

function handleUpdate(brokerageInvestment: Partial<BrokerageInvestment>) {
  emit('update', brokerageInvestment)
  showModal.value = false;
}


function handleCreate(brokerageInvestmentPartial: Partial<BrokerageInvestment>) {
  emit('create', brokerageInvestmentPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.brokerageInvestment);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>