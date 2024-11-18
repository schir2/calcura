<template>
  <CommonCard>
    <h2 class="text-2xl">Income: {{ income.name }}</h2>
    <CommonButton @click="deleteIncome(incomeIndex)">
      <TrashIcon/>
    </CommonButton>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
          <FormField :field="fieldMetadata.name" :model="income"></FormField>
          <FormField :field="fieldMetadata.grossIncome" :model="income"></FormField>
          <FormSelect :field="fieldMetadata.growthStrategy" :model="income"></FormSelect>
          <FormField :field="fieldMetadata.growthRate" :model="income"></FormField>
          <FormField :field="fieldMetadata.taxRate" :model="income"></FormField>
          <FormSelect :field="fieldMetadata.taxStrategy" :model="income"></FormSelect>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import Income from "~/models/Income";
import {incomeFields} from "~/forms/incomeForm";

interface Props {
  income: Income
  showAdvancedOptions: boolean;
  incomeIndex: number;
}

const emit = defineEmits({
  deleteIncome(payload: { index: number }){

  }
})

function deleteIncome(incomeIndex: number) {
  emit('deleteIncome',  {index: incomeIndex})
}

const fieldMetadata = incomeFields

const {showAdvancedOptions = false, income = new Income(Income.defaultValues()), incomeIndex} = defineProps<Props>()

</script>