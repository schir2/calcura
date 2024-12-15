<template>
<Form>
  <FormTextInput :field="incomeFields.name" :modelValue="incomePartial"></FormTextInput>
  <FormSelect :field="incomeFields.incomeType" :model="incomePartial"></FormSelect>
  <FormSelect :field="incomeFields.frequency" :model="incomePartial"></FormSelect>
  <FormTextInput :field="incomeFields.grossIncome" :modelValue="incomePartial"></FormTextInput>
  <FormTextInput :field="incomeFields.growthRate" :modelValue="incomePartial"></FormTextInput>
</Form>
</template>
<script lang="ts" setup>
import type {IncomePartial} from "~/models/income/Income";
const props = defineProps<Props>()
import {incomeFields} from "~/forms/incomeForm";
interface Props {
  incomePartial: IncomePartial
}
</script>