<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Income {{ incomeIndex + 1 }}: {{ income.name }}</h3>
      <CommonButton @click="deleteIncome(incomeIndex)">
        <TrashIcon/>
      </CommonButton>
    </div>
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

const {showAdvancedOptions = false, income, incomeIndex} = defineProps<Props>()
const fieldMetadata = incomeFields

const emit = defineEmits({
  deleteIncome(payload: { index: number }) {
  }
})

function deleteIncome(incomeIndex: number) {
  emit('deleteIncome', {index: incomeIndex})
}


</script>