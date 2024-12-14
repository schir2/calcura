<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">BrokerageInvestment {{ brokerageInvestment.id }}: {{ currentBrokerageInvestmentConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteBrokerageInvestment">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetBrokerageInvestment">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateBrokerageInvestment">Save</NButton>
    </div>
    <Form class="space-y-6">
      <div class="grid grid-cols-3 gap-3">
        <FormTextInput :model="brokerageInvestment" :field="fieldMetadata.name"/>
        <FormTextInput :model="brokerageInvestment" :field="fieldMetadata.initialBalance"/>
        <FormTextInput :model="brokerageInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :model="brokerageInvestment" :field="fieldMetadata.contributionStrategy"/>
          <FormTextInput :model="brokerageInvestment" :field="fieldMetadata.contributionPercentage"/>
          <FormTextInput :model="brokerageInvestment" :field="fieldMetadata.contributionFixedAmount"/>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/useEntityManager';
import {brokerageInvestmentFields} from '~/forms/brokerageInvestmentForm';
import type {BrokerageInvestment} from '~/models/brokerageInvestment/BrokerageInvestment';

interface Props {
  brokerageInvestment: BrokerageInvestment;
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, brokerageInvestment} = defineProps<Props>();
const fieldMetadata = brokerageInvestmentFields;

const emit = defineEmits(['deleteBrokerageInvestment', 'updateBrokerageInvestment']);

const {
  currentConfig: currentBrokerageInvestmentConfig,
  isModified,
  resetEntity: resetBrokerageInvestment,
  deleteEntity: deleteBrokerageInvestment,
  updateEntity: updateBrokerageInvestment
} = useEntityManager<BrokerageInvestment>(brokerageInvestment, emit, 'brokerageInvestment');


</script>