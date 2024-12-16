<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">TaxDeferredInvestment {{ taxDeferredInvestment.id }}: {{ currentTaxDeferredInvestmentConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateTaxDeferredInvestment"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetTaxDeferredInvestment"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteTaxDeferredInvestment"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>

    </div>
    <Form>

          <FormTextInput :field="fieldMetadata.name" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentTaxDeferredInvestmentConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.principal" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.interestRate" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.paymentMinimum" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentTaxDeferredInvestmentConfig.paymentStrategy === 'percentage_of_taxDeferredInvestment'" :field="fieldMetadata.paymentPercentage" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentTaxDeferredInvestmentConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :modelValue="currentTaxDeferredInvestmentConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {taxDeferredInvestmentForm} from '~/forms/taxDeferredInvestmentForm';
import type {TaxDeferredInvestment} from '~/models/taxDeferredInvestment/TaxDeferredInvestment';

interface Props {
  taxDeferredInvestment: TaxDeferredInvestment;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, taxDeferredInvestment } = defineProps<Props>();
const fieldMetadata = taxDeferredInvestmentForm;

const emit = defineEmits(['deleteTaxDeferredInvestment', 'updateTaxDeferredInvestment']);

const {
  currentConfig: currentTaxDeferredInvestmentConfig,
  isModified,
  resetEntity: resetTaxDeferredInvestment,
  deleteEntity: deleteTaxDeferredInvestment,
  updateEntity: updateTaxDeferredInvestment
} = useEntityManager<TaxDeferredInvestment>(taxDeferredInvestment, emit, 'taxDeferredInvestment');


</script>