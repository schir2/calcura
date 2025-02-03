<template>
  <n-modal v-model:show="showModal">
    <TaxDeferredInvestmentForm :initialValues="taxDeferredInvestment" mode="edit"
                               @delete="handleDelete"
                               @create="handleCreate"
                               @update="handleUpdate"
                               @cancel="handleClose"
                               :incomes="incomes"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{taxDeferredInvestment.id}} {{ taxDeferredInvestment.name }}</span>
      <n-tag>{{ taxDeferredInvestment.electiveContributionStrategy }}</n-tag>
      <n-tag>{{ taxDeferredInvestment.employerContributionStrategy }}</n-tag>
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
import type {Income} from "~/models/income/Income";

interface Props {
  taxDeferredInvestment: TaxDeferredInvestment
  incomes: Income[] | undefined
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