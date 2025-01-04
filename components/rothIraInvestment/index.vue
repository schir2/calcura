<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">RothIraInvestment {{ rothIraInvestment.id }}: {{ currentRothIraInvestmentConfig.name }}</h3>

      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateRothIraInvestment"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetRothIraInvestment"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteRothIraInvestment"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>

    </div>
    <Form>

          <FormTextInput :field="fieldMetadata.name" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentRothIraInvestmentConfig"></FormSelect>
          <FormTextInput :field="fieldMetadata.principal" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.interestRate" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.paymentMinimum" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentRothIraInvestmentConfig.paymentStrategy === 'percentage_of_rothIraInvestment'" :field="fieldMetadata.paymentPercentage" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
          <FormTextInput v-if="currentRothIraInvestmentConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :modelValue="currentRothIraInvestmentConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {rothIraInvestmentForm} from '~/forms/rothIraInvestmentForm';
import type {RothIraInvestment} from '~/models/rothIraInvestment/RothIraInvestment';

interface Props {
  rothIraInvestment: RothIraInvestment;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, rothIraInvestment } = defineProps<Props>();
const fieldMetadata = rothIraInvestmentForm;

const emit = defineEmits(['deleteRothIraInvestment', 'updateRothIraInvestment']);

const {
  currentConfig: currentRothIraInvestmentConfig,
  isModified,
  resetEntity: resetRothIraInvestment,
  deleteEntity: deleteRothIraInvestment,
  updateEntity: updateRothIraInvestment
} = useEntityManager<RothIraInvestment>(rothIraInvestment, emit, 'rothIraInvestment');


</script>