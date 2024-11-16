<script setup lang="ts">
import FormModel from "~/utils/FormModel";
import {retirementFields} from "~/forms/retirementForm";
import type {RetirementData} from "~/models/Retirement";

const form = reactive(new FormModel<RetirementData>(retirementFields));
interface Props{
  showAdvancedOptions?: boolean;
}
const {showAdvancedOptions = false} = defineProps<Props>()
</script>
<template>
  <CommonCard>
    <h2 class="text-2xl">Retirement Plan</h2>
    <Form class="grid grid-cols-6 gap-3">
      <FormField :field="form.age"/>
      <FormField v-show="showAdvancedOptions" :field="form.year"/>
      <FormField v-show="showAdvancedOptions" :field="form.lifeExpectancy"/>
      <FormSelect :field="form.retirementStrategy"/>
      <FormField :field="form.retirementWithdrawalRate"/>
      <FormField v-if="form.retirementStrategy.value === 'age'" :field="form.retirementAge"/>

      <FormField v-if="form.retirementStrategy.value === 'targetSavings'" :field="form.retirementSavingsAmount"/>
      <FormField v-if="form.retirementStrategy.value === 'percentRule'" :field="form.retirementIncomeGoal"/>
      <FormField v-if="form.retirementStrategy.value === 'percentRule'" :field="form.retirementIncomeProjected"/>
    </Form>
  </CommonCard>
</template>