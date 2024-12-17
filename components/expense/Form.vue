<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Expense: {{ expensePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
        </n-form-item>

        <n-form-item path="amount" label="Amount" v-bind="formFields.amount.props">
          <n-input-number v-model:value="formFields.amount.value"/>
        </n-form-item>

        <n-form-item path="expenseType" label="Expense Type" v-bind="formFields.expenseType.props">
          <n-select v-model:value="formFields.expenseType.value" :options="expenseForm.expenseType.options"/>
        </n-form-item>

        <n-form-item path="frequency" label="Frequency" v-bind="formFields.frequency.props">
          <n-select v-model:value="formFields.frequency.value" :options="expenseForm.frequency.options"/>
        </n-form-item>

        <n-form-item path="isEssential" label="Essential?" v-bind="formFields.isEssential.props">
          <n-switch v-model:value="formFields.isEssential.value"/>
        </n-form-item>

        <n-form-item path="isTaxDeductible" :label="expenseForm.isTaxDeductible.label" v-bind="formFields.isTaxDeductible.props">
          <n-switch v-model:value="formFields.isTaxDeductible.value" suffix="%"/>
        </n-form-item>

        <n-form-item path="growsWithInflation" :label="expenseForm.growsWithInflation.label" v-bind="formFields.growsWithInflation.props">
          <n-switch v-model:value="formFields.growsWithInflation.value" suffix="%"/>
        </n-form-item>

        <n-form-item path="growthRate" :label="expenseForm.growthRate.label" v-bind="formFields.growthRate.props">
          <n-space vertical class="w-full">
            <n-slider v-model:value="formFields.growthRate.value" :min="0" :max="100"/>
            <n-input-number v-model:value="formFields.growthRate.value" size="small"/>
          </n-space>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {expenseForm, expenseFormSchema} from "~/forms/expenseForm";
import {useForm} from "vee-validate";
import type {Expense} from "~/models/expense/Expense";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

interface Props {
  expensePartial: Partial<Expense>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: expenseFormSchema,
  initialValues: props.expensePartial,
});

const formFields = ref(useFieldHelpers(expenseForm, defineField));


function handleCreate() {
  emit('create', values)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', values)
}
</script>