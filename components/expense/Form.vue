<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Expense: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label="Expense Name">
            <n-input v-model:value="modelRef.name" placeholder="Enter expense name"/>
          </n-form-item>

          <n-form-item path="amount" label="Expense Amount">
            <n-input-number v-model:value="modelRef.amount" placeholder="Enter amount"/>
          </n-form-item>

          <n-form-item path="growthRate" label="Growth Rate">
            <n-space vertical class="w-full">
              <n-input-number class="w-full" v-model:value="modelRef.growthRate"
                              :disabled="modelRef.growsWithInflation"/>
            </n-space>
          </n-form-item>
        </section>

        <n-form-item path="frequency" label="Frequency">
          <n-radio-group v-model:value="modelRef.frequency">
            <n-radio-button v-for="option in [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annually' }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <section class="grid grid-cols-4 gap-3">
          <n-form-item path="expenseType" label="Expense Type">
            <n-radio-group v-model:value="modelRef.expenseType">
              <n-radio-button v-for="option in [
                { label: 'Fixed', value: 'fixed' },
                { label: 'Variable', value: 'variable' }
              ]" :key="option.value" :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>

          <n-form-item class="justify-center" path="isEssential" label="Essential Expense">
            <n-switch v-model:value="modelRef.isEssential"/>
          </n-form-item>

          <n-form-item path="isTaxDeductible" label="Tax Deductible">
            <n-switch v-model:value="modelRef.isTaxDeductible" suffix="%"/>
          </n-form-item>

          <n-form-item path="growsWithInflation" label="Grows With Inflation">
            <n-switch v-model:value="modelRef.growsWithInflation" suffix="%"/>
          </n-form-item>
        </section>
      </n-form>
    </template>

    <template #footer>
      <n-statistic class="text-end">${{
          $humanize.intComma(getAnnualAmount(modelRef.amount ?? 0, modelRef.frequency ?? Frequency.Annually))
        }}/year
      </n-statistic>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {type Expense} from "~/models/expense/Expense";
import {useCrudFormWithValidation} from "~/composables/useCrudFormWithValidation";
import {getAnnualAmount} from "~/utils";
import {Frequency} from "~/types/Frequency";

interface Props {
  initialValues: Partial<Expense>;
  mode: "create" | "edit";
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(props.initialValues, emit, useExpenseValidation);
</script>
