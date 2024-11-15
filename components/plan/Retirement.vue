<script setup lang="ts">
import FormModel from "~/utils/FormModel";
import {retirementFields} from "~/forms/retirementForm";
import type {RetirementData} from "~/models/Retirement";

const form = reactive(new FormModel<RetirementData>(retirementFields));


</script>
<template>
  <CommonCard>
    <h2 class="text-2xl">Plan: {{ form.retirementStrategy.value }}</h2>
    <Form>
      <FormField :field="form.age"/>
      <FormField :field="form.year"/>
      <FormField :field="form.lifeExpectancy"/>
      <FormField :field="form.retirementStrategy"/>
      <FormField :field="form.retirementWithdrawalRate"/>
      <FormField v-if="form.retirementStrategy.value === 'targetSavings'" :field="form.retirementIncomeGoal"/>
      <FormField :field="form.retirementAge"/>
      <FormField :field="form.retirementSavingsAmount"/>
      <FormField :field="form.retirementIncomeProjected"/>
    </Form>
  </CommonCard>
</template>