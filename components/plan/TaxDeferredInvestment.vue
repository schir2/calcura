<script setup lang="ts">
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import {taxDeferredInvestmentFields} from "~/forms/taxDeferredInvestmentForm";
import FormModel from '~/utils/FormModel'


const form = reactive(new FormModel<TaxDeferredInvestmentData>(taxDeferredInvestmentFields));

interface Props {
  showAdvancedOptions: boolean;
}

const {showAdvancedOptions = false} = defineProps<Props>()


</script>

<template>
  <CommonCard>
    <Form class="space-y-6">
      <h2 class="text-2xl">{{ form.name.value ? form.name.value : 'Tax Deferred Investment' }}</h2>
      <div class="grid grid-cols-3 gap-3">
        <FormField :field="form.name"/>
        <FormField :field="form.balance"/>
        <FormField v-show="showAdvancedOptions" :field="form.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Elective Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :field="form.electiveContributionStrategy"/>
          <FormField :field="form.electiveContributionPercentage"/>
          <FormField :field="form.electiveContributionFixedAmount"/>
        </div>
        <FormToggle :field="form.employerContributes"/>
        {{ form.employerContributes.value }}
      </section>
      <section v-if="form.employerContributes.value">
        <h3 class="text-xl">Employer Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :field="form.employerContributionStrategy"/>
          <FormField :field="form.employerCompensationMatchPercentage"/>
          <FormField :field="form.employerContributionFixedAmount"/>
          <FormField :field="form.employerMatchPercentage"/>
          <FormField :field="form.employerMatchPercentageLimit"/>
        </div>
      </section>
    </Form>
  </CommonCard>
</template>

<style scoped>

</style>N