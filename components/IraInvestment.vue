<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">IraInvestment {{ iraInvestment.id }}: {{ currentIraInvestmentConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteIraInvestment">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetIraInvestment">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateIraInvestment">Save</NButton>
    </div>
    <Form class="space-y-6">
      <div class="grid grid-cols-3 gap-3">
        <FormTextInput :model="iraInvestment" :field="fieldMetadata.name"/>
        <FormToggle :model="iraInvestment" :field="fieldMetadata.isContributionTaxDeferred"/>
        <FormTextInput :model="iraInvestment" :field="fieldMetadata.initialBalance"/>
        <FormTextInput :model="iraInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :model="iraInvestment" :field="fieldMetadata.contributionStrategy"/>
          <FormTextInput :model="iraInvestment" :field="fieldMetadata.contributionPercentage"/>
          <FormTextInput :model="iraInvestment" :field="fieldMetadata.contributionFixedAmount"/>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/useEntityManager';
import {iraInvestmentFields} from '~/forms/iraInvestmentForm';
import type {IraInvestment} from '~/models/iraInvestment/IraInvestment';

interface Props {
  iraInvestment: IraInvestment;
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, iraInvestment} = defineProps<Props>();
const fieldMetadata = iraInvestmentFields;

const emit = defineEmits(['deleteIraInvestment', 'updateIraInvestment']);

const {
  currentConfig: currentIraInvestmentConfig,
  isModified,
  resetEntity: resetIraInvestment,
  deleteEntity: deleteIraInvestment,
  updateEntity: updateIraInvestment
} = useEntityManager<IraInvestment>(iraInvestment, emit, 'iraInvestment');


</script>