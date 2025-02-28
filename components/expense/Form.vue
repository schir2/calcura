<script lang="ts" setup>
import {type Expense, expenseDefaults} from "~/types/Expense";
import {useCrudFormWithValidation} from "~/composables/useCrudFormWithValidation";
import {getAnnualAmount} from "~/utils";
import {Frequency} from "~/types/Frequency";
import {FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants";

interface Props {
  initialValues?: Partial<Expense>;
  mode: "create" | "edit";
}

const {initialValues = expenseDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(initialValues, emit, useExpenseValidation);
</script>
<template>
  <n-card role="dialog" :class="FORM_MODAL_WIDTH_CLASS" :bordered="true">
    <template #header>
      <h3 class="text-2xl flex items-center gap-2"><base-ico class="text-skin-warning" name="expense"/> Expense: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form
          ref="formRef"
          :model="modelRef"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >

        <n-form-item path="name" label="Name">
          <n-input v-model:value="modelRef.name" placeholder="Enter expense name"/>
        </n-form-item>

        <n-form-item path="amount" label="Amount">
          <n-input-number v-model:value="modelRef.amount" placeholder="Enter amount"/>
        </n-form-item>

        <n-form-item path="growthRate" label="Growth Rate">
          <n-space vertical>
            <n-input-number v-model:value="modelRef.growthRate"
                            :disabled="modelRef.growsWithInflation"/>
          </n-space>
        </n-form-item>


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
      </n-form>
    </template>

    <template #footer>
      <n-statistic class="text-end">
        <span class="text-skin-error">-${{
          $humanize.intComma(getAnnualAmount(modelRef.amount ?? 0, modelRef.frequency ?? Frequency.Annually))
        }}/year</span>
      </n-statistic>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>