<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Income {{ income.id }}: {{ currentIncomeConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteIncome">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetIncome">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateIncome">Save</NButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
          <FormField :field="fieldMetadata.name" :model="income"></FormField>
          <FormField :field="fieldMetadata.grossIncome" :model="income"></FormField>
          <FormField :field="fieldMetadata.growthRate" :model="income"></FormField>
          <FormSelect :field="fieldMetadata.incomeType" :model="income"></FormSelect>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/useEntityManager';
import {incomeFields} from '~/forms/incomeForm';
import type {Income} from '~/models/income/Income';

interface Props {
  income: Income;
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, income} = defineProps<Props>();
const fieldMetadata = incomeFields;

const emit = defineEmits(['deleteIncome', 'updateIncome']);

const {
  currentConfig: currentIncomeConfig,
  isModified,
  resetEntity: resetIncome,
  deleteEntity: deleteIncome,
  updateEntity: updateIncome
} = useEntityManager<Income>(income, emit, 'income');


</script>