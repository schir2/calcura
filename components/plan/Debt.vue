<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Debt {{ debtIndex + 1 }}: {{ debt.name }}</h3>
      <CommonButton @click="deleteDebt(debtIndex)">
        <TrashIcon/>
      </CommonButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
          <FormField :field="fieldMetadata.name" :model="debt"></FormField>
          <FormField :field="fieldMetadata.principal" :model="debt"></FormField>
          <FormField :field="fieldMetadata.interestRate" :model="debt"></FormField>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="debt"></FormSelect>
          <FormField :field="fieldMetadata.paymentMinimum" :model="debt"></FormField>
          <FormField :field="fieldMetadata.paymentPercentage" :model="debt"></FormField>
          <FormField :field="fieldMetadata.paymentFixedAmount" :model="debt"></FormField>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import Debt from "~/models/Debt";
import {debtFields} from "~/forms/debtForm";

interface Props {
  debt: Debt
  showAdvancedOptions: boolean;
  debtIndex: number;
}

const {showAdvancedOptions = false, debt, debtIndex} = defineProps<Props>()
const fieldMetadata = debtFields

const emit = defineEmits({
  deleteDebt(payload: { index: number }) {
  }
})

function deleteDebt(debtIndex: number) {
  emit('deleteDebt', {index: debtIndex})
}


</script>