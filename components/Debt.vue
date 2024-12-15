<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Debt {{ debt.id }}: {{ currentDebtConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateDebt"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetDebt"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteDebt"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>

    </div>
    <Form>

          <FormTextInput :field="fieldMetadata.name" :modelValue="currentDebtConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentDebtConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.principal" :modelValue="currentDebtConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.interestRate" :modelValue="currentDebtConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.paymentMinimum" :modelValue="currentDebtConfig"></FormTextInput>
          <FormTextInput v-if="currentDebtConfig.paymentStrategy === 'percentage_of_debt'" :field="fieldMetadata.paymentPercentage" :modelValue="currentDebtConfig"></FormTextInput>
          <FormTextInput v-if="currentDebtConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :modelValue="currentDebtConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {debtFields} from '~/forms/debtForm';
import type {Debt} from '~/models/debt/Debt';

interface Props {
  debt: Debt;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, debt } = defineProps<Props>();
const fieldMetadata = debtFields;

const emit = defineEmits(['deleteDebt', 'updateDebt']);

const {
  currentConfig: currentDebtConfig,
  isModified,
  resetEntity: resetDebt,
  deleteEntity: deleteDebt,
  updateEntity: updateDebt
} = useEntityManager<Debt>(debt, emit, 'debt');


</script>