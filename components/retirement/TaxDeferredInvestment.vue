<script setup lang="ts">
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import {EmployerContributionOptions} from "~/constants/employerContribution";
import {TaxDeferredContributionOptions} from "~/constants/taxDeferred";
import {taxDeferredInvestmentFields} from "~/forms/taxDeferredInvestmentForm";
import FormModel from '~/utils/FormModel'


const form = reactive(new FormModel<TaxDeferredInvestmentData>(taxDeferredInvestmentFields));

watchEffect(() => {
  const dataObject = form.toObject();
})

</script>

<template>k
  <CommonCard>
    <Form>
      <div class="space-y-6">
        <h2 class="text-2xl">Tax Deferred Investment</h2>
        <FormField :field ="form.name"/>
        <FormInput :name="form.balance.name" type="number" label="Current Savings" v-model="form.balance.value" :rules="form.balance"/>
        <FormInput :name="form.growthRate.name" type="number" label="Growth Rate" v-model="form.growthRate.value" :rules="form.growthRate"/>
        <section>
          <h3 class="text-xl">Elective Contributions</h3>
          <FormSelect :name="form.employerContributionStrategy.name" v-model="form.employerContributionStrategy.value" :options="EmployerContributionOptions"/>
          <FormInput :name="form.electiveContributionPercentage.name" v-model="form.electiveContributionPercentage.value" label="electiveContributionPercentage" placeholder="electiveContributionPercentage" :rules="form.electiveContributionPercentage"/>
          <FormInput :name="form.electiveContributionFixedAmount.name" v-model="form.electiveContributionFixedAmount.value" label="electiveContributionFixedAmount" placeholder="electiveContributionFixedAmount" :rules="form.electiveContributionPercentage"/>
        </section>
        <FormInputToggle :name="form.employerContributes.name" v-model="form.employerContributes.value" label="employerContributes" :rules="form.employerContributes"/>
        <section v-if="form.employerContributes.value">
          <h3 class="text-xl">Employer Contributions</h3>
          <FormSelect :name="form.employerContributionStrategy.name" v-model="form.employerContributionStrategy.value" :options="TaxDeferredContributionOptions" label="employerContributionStrategy" :rules="form.employerContributionStrategy"/>
          <FormInput :name="form.employerCompensationMatchPercentage.name" v-model="form.employerCompensationMatchPercentage.value" label="employerCompensationMatchPercentage" placeholder="employerCompensationMatchPercentage" :rules="form.employerCompensationMatchPercentage"/>
          <FormInput :name="form.employerContributionFixedAmount.name" v-model="form.employerContributionFixedAmount.value" label="employerContributionFixedAmount" placeholder="employerContributionFixedAmount" :rules="form.employerContributionFixedAmount"/>
          <FormInput :name="form.employerMatchPercentage.name" v-model="form.employerMatchPercentage.value" label="employerMatchPercentage" placeholder="employerMatchPercentage" :rules="form.employerMatchPercentage"/>
          <FormInput :name="form.employerMatchPercentageLimit.name" v-model="form.employerMatchPercentageLimit.value" label="employerMatchPercentageLimit" placeholder="employerMatchPercentageLimit" :rules="form.employerMatchPercentageLimit"/>
        </section>
      </div>
    </Form>
  </CommonCard>
  {{ form.toObject() }}
</template>

<style scoped>

</style>N