<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Income {{ income.id }}: {{ currentIncomeConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateIncome"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetIncome"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteIncome"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>
    </div>
    <Form>
      <section>
          <FormTextInput :field="fieldMetadata.name" :modelValue="currentIncomeConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.incomeType" :model="currentIncomeConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.grossIncome" :modelValue="currentIncomeConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.growthRate" :modelValue="currentIncomeConfig"></FormTextInput>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {incomeFields} from '~/forms/incomeForm';
import type {Income} from '~/models/income/Income';

interface Props {
  income: Income;
  isEditing?: boolean;
}

const {isEditing = false, income} = defineProps<Props>();
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