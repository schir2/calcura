<script lang="ts" setup>
import {type Expense, expenseDefaults} from "~/types/Expense";
import {useCrudFormWithValidation} from "~/composables/useCrudFormWithValidation";
import {getAnnualAmount} from "~/utils";
import {Frequency} from "~/types/Frequency";
import {FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants";

type Props = {
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
          @submit.prevent="$emit('create')"
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

        <n-form-item path="growth_rate" label="Growth Rate">
          <n-space vertical>
            <n-input-number v-model:value="modelRef.growth_rate"
                            :disabled="modelRef.grows_with_inflation"/>
          </n-space>
        </n-form-item>


        <n-form-item path="frequency" label="Frequency">
          <n-radio-group v-model:value="modelRef.frequency">
            <n-radio-button v-for="option in [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annual' }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>
        <n-form-item path="expense_type" label="Expense Type">
          <n-radio-group v-model:value="modelRef.expense_type">
            <n-radio-button v-for="option in [
                { label: 'Fixed', value: 'fixed' },
                { label: 'Variable', value: 'variable' }
              ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item class="justify-center" path="is_essential" label="Essential Expense">
          <n-switch v-model:value="modelRef.is_essential"/>
        </n-form-item>

        <n-form-item path="is_tax_deductible" label="Tax Deductible">
          <n-switch v-model:value="modelRef.is_tax_deductible" suffix="%"/>
        </n-form-item>

        <n-form-item path="grows_with_inflation" label="Grows With Inflation">
          <n-switch v-model:value="modelRef.grows_with_inflation" suffix="%"/>
        </n-form-item>
      </n-form>
    </template>

    <template #footer>
      <base-stat class="text-end">
        <span class="text-skin-error">-${{
          $humanize.intComma(getAnnualAmount(modelRef.amount ?? 0, modelRef.frequency ?? Frequency.Annually))
        }}/year</span>
      </base-stat>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>