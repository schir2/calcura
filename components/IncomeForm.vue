<template>
<Form>
  <FormTextInput :field="incomeFields.name" :model="incomePartial"></FormTextInput>
  <FormSelect :field="incomeFields.incomeType" :model="incomePartial"></FormSelect>
  <FormSelect :field="incomeFields.frequency" :model="incomePartial"></FormSelect>
  <FormTextInput :field="incomeFields.grossIncome" :model="incomePartial"></FormTextInput>
  <FormTextInput :field="incomeFields.growthRate" :model="incomePartial"></FormTextInput>
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