<template>
  <CommonCard>
    <Form class="space-y-6">
      <h2 class="text-2xl">{{ taxDeferredInvestment.name }}</h2>
      <div class="grid grid-cols-3 gap-3">
        <FormField :model="taxDeferredInvestment" :field="fieldMetadata.name"/>
        <FormField :model="taxDeferredInvestment" :field="fieldMetadata.balance"/>
        <FormField :model="taxDeferredInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Elective Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionStrategy"/>
          <FormField :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionPercentage"/>
          <FormField :model="taxDeferredInvestment" :field="fieldMetadata.electiveContributionFixedAmount"/>
        </div>
        <!--        <FormToggle v-model="taxDeferredInvestment" :field="fieldMetadata.employerContributes"/>-->
        {{ taxDeferredInvestment.employerContributes }}
      </section>
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
    </Form>
  </CommonCard>
</template>
<script setup lang="ts">
import TaxDeferredInvestment from "~/models/TaxDeferredInvestment";
import {taxDeferredInvestmentFields} from "~/forms/taxDeferredInvestmentForm";


const fieldMetadata = taxDeferredInvestmentFields

interface Props {
  showAdvancedOptions: boolean;
}

const {showAdvancedOptions = false} = defineProps<Props>()
const taxDeferredInvestment = reactive(new TaxDeferredInvestment(TaxDeferredInvestment.defaultValues()))


</script>
