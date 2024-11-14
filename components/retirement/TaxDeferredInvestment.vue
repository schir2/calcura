<script setup lang="ts">
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import {
  DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT,
  DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
  DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
  DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE,
  DEFAULT_EMPLOYER_CONTRIBUTES,
  DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT,
  DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
  DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
  DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
  DEFAULT_INVESTMENT_GROWTH_RATE
} from "~/constants/financial";
import {EmployerContributionOptions} from "~/constants/employerContribution";
import type {SelectOption} from "~/components/form/Select.vue";

let data: TaxDeferredInvestmentData = {
  name: '',
  growthRate: DEFAULT_INVESTMENT_GROWTH_RATE,
  balance: 0,
  electiveContributionStrategy: DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
  electiveContributionPercentage: DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
  electiveContributionFixedAmount: DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT,
  employerContributes: DEFAULT_EMPLOYER_CONTRIBUTES,
  employerContributionStrategy: DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
  employerCompensationMatchPercentage: DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE,
  employerContributionFixedAmount: DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT,
  employerMatchPercentage: DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
  employerMatchPercentageLimit: DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
}

</script>

<template>
  <CommonCard>
    <h2 class="text-2xl">Tax Deferred Investment</h2>
    <FormInput name="name" type="text" label="Name" placeholder="Tax Deferred Investment"/>
    <FormSelect :options="EmployerContributionOptions"/>
  </CommonCard>
</template>

<style scoped>

</style>N