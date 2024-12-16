<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">IraInvestment {{ iraInvestment.id }}: {{ currentIraInvestmentConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateIraInvestment"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetIraInvestment"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteIraInvestment"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>

    </div>
    <Form>

          <FormTextInput :field="fieldMetadata.name" :modelValue="currentIraInvestmentConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentIraInvestmentConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.principal" :modelValue="currentIraInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.interestRate" :modelValue="currentIraInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.paymentMinimum" :modelValue="currentIraInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentIraInvestmentConfig.paymentStrategy === 'percentage_of_iraInvestment'" :field="fieldMetadata.paymentPercentage" :modelValue="currentIraInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentIraInvestmentConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :modelValue="currentIraInvestmentConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {iraInvestmentForm} from '~/forms/iraInvestmentForm';
import type {IraInvestment} from '~/models/iraInvestment/IraInvestment';

interface Props {
  iraInvestment: IraInvestment;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, iraInvestment } = defineProps<Props>();
const fieldMetadata = iraInvestmentForm;

const emit = defineEmits(['deleteIraInvestment', 'updateIraInvestment']);

const {
  currentConfig: currentIraInvestmentConfig,
  isModified,
  resetEntity: resetIraInvestment,
  deleteEntity: deleteIraInvestment,
  updateEntity: updateIraInvestment
} = useEntityManager<IraInvestment>(iraInvestment, emit, 'iraInvestment');


</script>