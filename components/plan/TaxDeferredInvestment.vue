<template>
    <CommonCard>
      <Form class="space-y-6">
        <div class="flex justify-between align-middle">
          <h3 class="text-2xl">{{ taxDeferredInvestment.name }}</h3>
          <CommonButton iconLeft="mdi:delete" @click="deleteInvestment(investmentIndex)">
          </CommonButton>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <FormField :model="taxDeferredInvestment" :field="fieldMetadata.name"/>
          <FormField :model="taxDeferredInvestment" :field="fieldMetadata.initialBalance"/>
          <FormField :model="taxDeferredInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
        </div>
        <section>
          <h3 class="text-xl">Elective Contributions</h3>
          <div class="grid grid-cols-3 gap-3">
            <FormSelect :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionStrategy"/>
            <FormField :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionPercentage"/>
            <FormField :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionFixedAmount"/>
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
              <FormField :model="taxDeferredInvestment" :field="fieldMetadata.employerCompensationMatchPercentage"/>
              <FormField :model="taxDeferredInvestment" :field="fieldMetadata.employerContributionFixedAmount"/>
              <FormField :model="taxDeferredInvestment" :field="fieldMetadata.employerMatchPercentage"/>
              <FormField :model="taxDeferredInvestment" :field="fieldMetadata.employerMatchPercentageLimit"/>
            </div>
          </section>
        </transition>
      </Form>
    </CommonCard>
</template>
<script setup lang="ts">
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import {taxDeferredInvestmentFields} from "~/forms/taxDeferredInvestmentForm";
import {defaultTaxDeferredInvestmentFactory} from "~/models/taxDeferred/TaxDeferredInvestmentFactories";

const taxDeferredInvestment = reactive(defaultTaxDeferredInvestmentFactory())

const fieldMetadata = taxDeferredInvestmentFields

interface Props {
  showAdvancedOptions: boolean;
  investment: TaxDeferredInvestmentConfig;
  investmentIndex: number;
}

const {showAdvancedOptions = false, investment, investmentIndex} = defineProps<Props>()

const emit = defineEmits({
  deleteInvestment(payload: { index: number }) {
  }
})

function deleteInvestment(investmentIndex: number) {
  emit('deleteInvestment', {index: investmentIndex})
}


</script>
