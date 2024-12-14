<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">TaxDeferredInvestment {{ taxDeferredInvestment.id }}: {{ currentTaxDeferredInvestmentConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteTaxDeferredInvestment">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetTaxDeferredInvestment">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateTaxDeferredInvestment">Save</NButton>
    </div>
    <Form class="space-y-6">
      <div class="grid grid-cols-3 gap-3">
        <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.name"/>
        <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.initialBalance"/>
        <FormTextInput :model="taxDeferredInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Elective Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionStrategy"/>
          <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionPercentage"/>
          <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionFixedAmount"/>
        </div>
        <FormToggle :model="taxDeferredInvestment" :field="fieldMetadata.employerContributes"/>
      </section>
      <transition
          name="custom-classes"
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeInUp"
      >
        <section v-if="taxDeferredInvestment.employerContributes">
          <h3 class="text-xl">Employer Contributions</h3>
          <div class="grid grid-cols-3 gap-3">
            <FormSelect :model="taxDeferredInvestment" :field="fieldMetadata.employerContributionStrategy"/>
            <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.employerCompensationMatchPercentage"/>
            <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.employerContributionFixedAmount"/>
            <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.employerMatchPercentage"/>
            <FormTextInput :model="taxDeferredInvestment" :field="fieldMetadata.employerMatchPercentageLimit"/>
          </div>
        </section>
      </transition>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import { useEntityManager } from '~/composables/useEntityManager';
import { taxDeferredInvestmentFields } from '~/forms/taxDeferredInvestmentForm';
import type { TaxDeferredInvestment } from '~/models/taxDeferredInvestment/TaxDeferredInvestment';

interface Props {
  taxDeferredInvestment: TaxDeferredInvestment;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, taxDeferredInvestment } = defineProps<Props>();
const fieldMetadata = taxDeferredInvestmentFields;

const emit = defineEmits(['deleteTaxDeferredInvestment', 'updateTaxDeferredInvestment']);

const {
  currentConfig: currentTaxDeferredInvestmentConfig,
  isModified,
  resetEntity: resetTaxDeferredInvestment,
  deleteEntity: deleteTaxDeferredInvestment,
  updateEntity: updateTaxDeferredInvestment
} = useEntityManager<TaxDeferredInvestment>(taxDeferredInvestment, emit, 'taxDeferredInvestment');


</script>