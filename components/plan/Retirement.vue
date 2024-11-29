<template>
  <CommonCard>
    <h2 class="text-3xl">RetirementConstants PlanConfig: {{ retirementConfig.name }}</h2>
    <Form class="grid grid-cols-6 gap-3">
      <FormField :model="retirementConfig" :field="fieldMetadata.name"/>
      <FormSelect :model="retirementConfig" :field="fieldMetadata.retirementStrategy"/>
      <FormField :model="retirementConfig" v-show="showAdvancedOptions" :field="fieldMetadata.lifeExpectancy"/>
      <FormField :model="retirementConfig" v-if="retirementConfig.retirementStrategy === 'age'" :field="fieldMetadata.retirementAge"/>

      <FormField :model="retirementConfig" v-if="retirementConfig.retirementStrategy === 'targetSavings'" :field="fieldMetadata.retirementSavingsAmount"/>
      <FormField :model="retirementConfig" v-if="retirementConfig.retirementStrategy === 'percentRule'" :field="fieldMetadata.retirementWithdrawalRate"/>
      <FormField :model="retirementConfig" v-if="retirementConfig.retirementStrategy === 'percentRule'" :field="fieldMetadata.retirementIncomeGoal"/>
    </Form>
  </CommonCard>
</template>
<script setup lang="ts">
import {retirementFields} from "~/forms/retirementForm";
import type RetirementConfig from "~/models/retirement/RetirementConfig";

const fieldMetadata = retirementFields;

interface Props {
  retirementConfig: RetirementConfig
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, retirementConfig} = defineProps<Props>()
</script>