<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">DebtConfig {{ debt.id }}: {{ debt.name }}</h3>
      <CommonButton iconLeft="mdi:delete" @click="deleteDebt">
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
          <FormField v-if="debt.paymentStrategy === 'percentage_of_debt'" :field="fieldMetadata.paymentPercentage" :model="debt"></FormField>
          <FormField v-if="debt.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :model="debt"></FormField>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {debtFields} from "~/forms/debtForm";
import type DebtConfig from "~/models/debt/DebtConfig";

interface Props {
  debt: DebtConfig
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, debt} = defineProps<Props>()
const fieldMetadata = debtFields

const emit = defineEmits(['deleteDebt']);

function deleteDebt() {
  assertDefined(debt.id, 'debtId')
  emit('deleteDebt', debt.id)
}


</script>