<template>
  <CommonCard>
    <h2 class="text-3xl">RetirementConstants PlanConfig: {{ retirement.name }}</h2>
    <Form class="grid grid-cols-6 gap-3">
      <FormField :model="retirement" :field="fieldMetadata.name"/>
      <FormSelect :model="retirement" :field="fieldMetadata.retirementStrategy"/>
      <FormField :model="retirement" v-show="showAdvancedOptions" :field="fieldMetadata.lifeExpectancy"/>
      <FormField :model="retirement" v-if="retirement.retirementStrategy === 'age'" :field="fieldMetadata.retirementAge"/>

      <FormField :model="retirement" v-if="retirement.retirementStrategy === 'targetSavings'" :field="fieldMetadata.retirementSavingsAmount"/>
      <FormField :model="retirement" v-if="retirement.retirementStrategy === 'percentRule'" :field="fieldMetadata.retirementWithdrawalRate"/>
      <FormField :model="retirement" v-if="retirement.retirementStrategy === 'percentRule'" :field="fieldMetadata.retirementIncomeGoal"/>
    </Form>
  </CommonCard>
</template>
<script setup lang="ts">
import {retirementFields} from "~/forms/retirementForm";
import RetirementConstants from "~/models/retirement/RetirementConstants";

const fieldMetadata = retirementFields;

interface Props {
  showAdvancedOptions?: boolean;
}

const retirement = reactive(new RetirementConstants(RetirementConstants.defaultValues()))
const {showAdvancedOptions = false} = defineProps<Props>()
</script>