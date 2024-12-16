<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">BrokerageInvestment {{ brokerageInvestment.id }}: {{ currentBrokerageInvestmentConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateBrokerageInvestment"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetBrokerageInvestment"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteBrokerageInvestment"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>

    </div>
    <Form>

          <FormTextInput :field="fieldMetadata.name" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentBrokerageInvestmentConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.principal" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.interestRate" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.paymentMinimum" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentBrokerageInvestmentConfig.paymentStrategy === 'percentage_of_brokerageInvestment'" :field="fieldMetadata.paymentPercentage" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentBrokerageInvestmentConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :modelValue="currentBrokerageInvestmentConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {brokerageInvestmentForm} from '~/forms/brokerageInvestmentForm';
import type {BrokerageInvestment} from '~/models/brokerageInvestment/BrokerageInvestment';

interface Props {
  brokerageInvestment: BrokerageInvestment;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, brokerageInvestment } = defineProps<Props>();
const fieldMetadata = brokerageInvestmentForm;

const emit = defineEmits(['deleteBrokerageInvestment', 'updateBrokerageInvestment']);

const {
  currentConfig: currentBrokerageInvestmentConfig,
  isModified,
  resetEntity: resetBrokerageInvestment,
  deleteEntity: deleteBrokerageInvestment,
  updateEntity: updateBrokerageInvestment
} = useEntityManager<BrokerageInvestment>(brokerageInvestment, emit, 'brokerageInvestment');


</script>