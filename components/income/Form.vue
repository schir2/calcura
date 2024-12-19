<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Income: {{ incomePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
        </n-form-item>

        <n-form-item path="incomeType" label="Income Type" v-bind="formFields.incomeType.props">
          <n-radio-group v-model:value="formFields.incomeType.value">
            <n-radio-button v-for="option in incomeForm.incomeType.options" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="frequency" label="Frequency" v-bind="formFields.frequency.props">
          <n-select v-model:value="formFields.frequency.value" :options="incomeForm.frequency.options"/>
        </n-form-item>

        <n-form-item path="grossIncome" label="Gross Income" v-bind="formFields.grossIncome.props">
          <n-input-number v-model:value="formFields.grossIncome.value"/>
        </n-form-item>

        <n-form-item path="growthRate" label="Growth Rate" v-bind="formFields.growthRate.props">
          <n-input-number v-model:value="formFields.growthRate.value" suffix="%"/>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {incomeForm, incomeFormSchema} from "~/forms/incomeForm";
import {useForm} from "vee-validate";
import type {Income} from "~/models/income/Income";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

interface Props {
  incomePartial: Partial<Income>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: incomeFormSchema,
  initialValues: props.incomePartial,
});

const formFields = ref(useFieldHelpers(incomeForm, defineField))

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