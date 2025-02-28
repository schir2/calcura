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
    <div class="flex justify-between">
      <div class="flex gap-2 items-center">
        <h3 class="flex items-center gap-2 text-lg">
          <base-ico class="text-skin-success" name="income"/>
          <span>{{ income.name }}</span>
        </h3>
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
        </p>
      </div>
      <div class="flex gap-2 items-center">
      <span class="text-lg">${{
          $humanize.intComma(getAnnualAmount(income.grossIncome, income.frequency))
        }}/year</span>
        <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </div>
    </div>
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