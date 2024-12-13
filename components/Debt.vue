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

          <FormField :field="fieldMetadata.name" :model="currentDebtConfig"></FormField>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentDebtConfig"></FormSelect>
          <FormField :field="fieldMetadata.principal" :model="currentDebtConfig"></FormField>
          <FormField :field="fieldMetadata.interestRate" :model="currentDebtConfig"></FormField>
          <FormField :field="fieldMetadata.paymentMinimum" :model="currentDebtConfig"></FormField>
          <FormField v-if="currentDebtConfig.paymentStrategy === 'percentage_of_debt'" :field="fieldMetadata.paymentPercentage" :model="currentDebtConfig"></FormField>
          <FormField v-if="currentDebtConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :model="currentDebtConfig"></FormField>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/useEntityManager';
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