<script setup lang="ts">
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import {taxDeferredInvestmentFields} from "~/forms/taxDeferredInvestmentForm";
import FormModel from '~/utils/FormModel'


const form = reactive(new FormModel<TaxDeferredInvestmentData>(taxDeferredInvestmentFields));

watchEffect(() => {
  const dataObject = form.toObject();
})

</script>

<template>
  <CommonCard class="grid grid-cols-2 gap-3">
    <Form>
      <div class="space-y-6">
        <h2 class="text-2xl">Tax Deferred Investment</h2>
        <FormField :field="form.name"/>
        <FormField :field="form.balance"/>
        <FormField :field="form.growthRate"/>
        <section>
          <h3 class="text-xl">Elective Contributions</h3>
          <FormSelect :field="form.employerContributionStrategy"/>
          <FormField :field="form.electiveContributionPercentage"/>
          <FormField :field="form.electiveContributionFixedAmount"/>
        </section>
        <FormInputToggle :name="form.employerContributes.name" v-model="form.employerContributes.value" label="employerContributes" :rules="form.employerContributes.rules"/>
        <section v-if="form.employerContributes.value">
          <h3 class="text-xl">Employer Contributions</h3>
          <FormSelect :field="form.employerContributionStrategy"/>
          <FormField :field="form.employerCompensationMatchPercentage"/>
          <FormField :field="form.employerContributionFixedAmount"/>
          <FormField :field="form.employerMatchPercentage"/>
          <FormField :field="form.employerMatchPercentageLimit"/>
        </section>
      </div>
    </Form>
    <div class="space-y-6">

      {{ form.toObject() }}
    </div>
  </CommonCard>
</template>

<style scoped>

</style>N