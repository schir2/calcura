<template>
  <n-modal v-model:show="showModal">
    <IncomeForm :initialValues="income" mode="edit"
                @delete="handleDelete"
                @create="handleCreate"
                @update="handleUpdate"
                @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <span>{{income.id}} {{ income.name }}</span>
    </template>
    <template #default>
      <p class="flex justify-between">
        <span class="flex">
          <n-tag>
            {{ income.incomeType }}
          </n-tag>
          <n-tag>
            <template #icon>
              <Icon name="mdi-calendar"></Icon>
            </template>
            {{ income.frequency }}
          </n-tag>
          <n-tag v-if="income.growthRate">
            <template #icon>
              <Icon name="mdi:trending-up"></Icon>
            </template>
            {{ income.growthRate }}%
          </n-tag>
        </span>
          <span class="text-lg">${{
              $humanize.intComma(getAnnualAmount(income.grossIncome, income.frequency))
            }}/year</span>
      </p>
    </template>
    <template #header-extra>
      <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
    </template>
  </n-card>

</template>
<script setup lang="ts">

import type {Income} from "~/types/Income";
import {getAnnualAmount} from "~/utils";

interface Props {
  income: Income
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.income);
}

function handleUpdate(income: Partial<Income>) {
  emit('update', income)
  showModal.value = false;
}


function handleCreate(incomePartial: Partial<Income>) {
  emit('create', incomePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.income);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>