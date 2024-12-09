<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">DebtConfig {{ debtConfig.id }}: {{ currentDebtConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteDebt">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetDebt">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateDebt">Save</NButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
          <FormField :field="fieldMetadata.name" :model="currentDebtConfig"></FormField>
          <FormField :field="fieldMetadata.principal" :model="currentDebtConfig"></FormField>
          <FormField :field="fieldMetadata.interestRate" :model="currentDebtConfig"></FormField>
          <FormSelect :field="fieldMetadata.paymentStrategy" :model="currentDebtConfig"></FormSelect>
          <FormField :field="fieldMetadata.paymentMinimum" :model="currentDebtConfig"></FormField>
          <FormField v-if="currentDebtConfig.paymentStrategy === 'percentage_of_debt'" :field="fieldMetadata.paymentPercentage" :model="currentDebtConfig"></FormField>
          <FormField v-if="currentDebtConfig.paymentStrategy ==='fixed'" :field="fieldMetadata.paymentFixedAmount" :model="currentDebtConfig"></FormField>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {debtFields} from "~/forms/debtForm";
import type DebtConfig from "~/models/debt/DebtConfig";

interface Props {
  debtConfig: DebtConfig
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, debtConfig} = defineProps<Props>()
const fieldMetadata = debtFields

const emit = defineEmits(['deleteDebt', 'updateDebt']);

function deleteDebt() {
  assertDefined(debtConfig.id, 'debtId')
  emit('deleteDebt', debtConfig.id)
}

function updateDebt() {
  assertDefined(debtConfig.id, 'debtId')
  emit('updateDebt', debtConfig)
}

const currentDebtConfig = reactive({ ...debtConfig });
const isModified = computed(() =>
    JSON.stringify(currentDebtConfig) !== JSON.stringify(debtConfig)
);

function resetDebt() {
  Object.assign(currentDebtConfig, { ...debtConfig });
}

</script>