<template>
  <NListItem color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">IncomeConfig {{ incomeConfig.id }}: {{ currentIncomeConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteIncome">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetIncome">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateIncome">Save</NButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
          <FormField :field="fieldMetadata.name" :model="incomeConfig"></FormField>
          <FormField :field="fieldMetadata.grossIncome" :model="incomeConfig"></FormField>
          <FormField :field="fieldMetadata.growthRate" :model="incomeConfig"></FormField>
          <FormSelect :field="fieldMetadata.incomeType" :model="incomeConfig"></FormSelect>
        </div>
      </section>
    </Form>
  </NListItem>

</template>
<script setup lang="ts">
import {incomeFields} from "~/forms/incomeForm";
import type IncomeConfig from "~/models/income/IncomeConfig";

interface Props {
  incomeConfig: IncomeConfig
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, incomeConfig} = defineProps<Props>()
const fieldMetadata = incomeFields

const emit = defineEmits(['deleteIncome', 'updateIncome']);

function deleteIncome() {
  assertDefined(incomeConfig.id, 'incomeId')
  emit('deleteIncome', incomeConfig.id)
}

function updateIncome() {
  assertDefined(incomeConfig.id, 'incomeId')
  emit('updateIncome', incomeConfig)
}

const currentIncomeConfig = reactive({ ...incomeConfig });
const isModified = computed(() =>
    JSON.stringify(currentIncomeConfig) !== JSON.stringify(incomeConfig)
);

function resetIncome() {
  Object.assign(currentIncomeConfig, { ...incomeConfig });
}

</script>