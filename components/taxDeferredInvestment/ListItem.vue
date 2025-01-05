<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredInvestmentForm :taxDeferredInvestmentPartial="taxDeferredInvestment" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
    <n-card size="small">
      <template #header>
        <span>{{ taxDeferredInvestment.name }}</span>
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

import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

interface Props {
  taxDeferredInvestment: TaxDeferredInvestment
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.taxDeferredInvestment);
}

function handleUpdate(taxDeferredInvestment: Partial<TaxDeferredInvestment>) {
  emit('update', taxDeferredInvestment)
  showModal.value = false;
}


function handleCreate(taxDeferredInvestmentPartial: Partial<TaxDeferredInvestment>) {
  emit('create', taxDeferredInvestmentPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.taxDeferredInvestment);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>